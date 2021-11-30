import argparse
import json
import csv
import os
import pandas as pd
import collections


def config(parser):
    parser.add_argument('--data_dir', default=os.getcwd() +
                        '/../initial_dataset/all_data/', type=str)
    parser.add_argument('--splits_dir', default=os.getcwd() +
                        '/../initial_dataset/all_data/hypotheses/', type=str)
    parser.add_argument('--save_dir', default=os.getcwd() +
                        '/temp/category_keys/', type=str)
    parser.add_argument(
        '--json_dir', default="./../initial_dataset/all_data/tables/", type=str)
    parser.add_argument(
        '--splits', default=["train", "test_alpha1"], action='store', type=str, nargs='*')
    return parser

'''
This file creates three kinds of files:
  1) category_count.json: for each table category, contains the total number of tables (across splits) falling in that category
  2) splitwise_categories.json: for each table category, for each split, contains the number of tables in that split falling in that category 
  3) category_keys/<split>_keys.json: for <split>, for each table category, contains:
      i) the ids of all the tables in that category in <split>
      ii) all the keys (row names) in the tables in this category, with the IDs of all the tables containing that key and also the average number of values in that key (row)

The above information is useful while doing initial automatic perturbation.
'''

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser = config(parser)
    args = vars(parser.parse_args())

    # create set of table categories (with count for each)
    categories_file = pd.read_csv(
        args['data_dir'] + 'table_categories.tsv', sep='\t')

    # find the total number of tables in each category (across splits) and save them in a file
    categories = collections.Counter(categories_file['category'].tolist())
    sorted_categories = dict(sorted(
        categories.items(), key=lambda category: category[1], reverse=True))
    with open(args['save_dir'] + '../category_count.json', 'w+') as out:
        json.dump(sorted_categories, out)

    # find the number of tables in each category split-wise:
    # we store this information in this dict
    splitwise_categories = {category: {
        split: 0 for split in args['splits']} for category in sorted_categories}
    table_cat_dict_all = {row['table_id']: row['category']
                          for index, row in categories_file.iterrows()}

    for split in args["splits"]:
        # read each table and create set of keys (with count + table numbers) for each category. Also find average number of values in each key.

        # set of all the tables in the split
        split_tables = set(pd.read_csv(
            args['splits_dir'] + 'infotabs_' + split + '.tsv', sep='\t', usecols=['table_id'], squeeze=True).tolist())

        # this is the dict which will store our output
        split_categories = {category: {'tables': [], 'keys': {}}
                            for category in sorted_categories}

        # for all tables in the split, add their info to the output dict
        for table in split_tables:
            # category of the table
            category = table_cat_dict_all[table]
            # add the table to the appropriate category in our output dict
            split_categories[category]['tables'].append(table)
            # for each key in the table, add the key to our output dict
            json_file = open("./T10.json", "r")
            json_file = open(args['json_dir'] + table + ".json", "r")
            data = json.load(
                json_file, object_pairs_hook=collections.OrderedDict)
            del data["title"]
            for key in data:
                values = data[key]
                if key not in split_categories[category]['keys']:
                    split_categories[category]['keys'][key] = {
                        'tables': [], 'avg_num_values': 0}
                split_categories[category]['keys'][key]['tables'].append(table)
                # right now, avg_num_values stores the total values. We calculate the actual avg_num in at the end
                split_categories[category]['keys'][key]['avg_num_values'] += len(
                    values)
        # calculate avg_num_values correctly
        for category, values in split_categories.items():
            for key, info in values['keys'].items():
                split_categories[category]['keys'][key]['avg_num_values'] /= len(
                    info['tables'])

        # sort our output dict so in order of the frequency of occurence of the keys
        sorted_split_categories = dict(sorted(
            split_categories.items(), key=lambda category: len(category[1]['tables']), reverse=True))

        # save our output dict
        with open(args['save_dir'] + split + '_keys.json', 'w+') as out:
            json.dump(sorted_split_categories, out)

        for category in split_categories:
            splitwise_categories[category][split] = len(
                split_categories[category]['tables'])
    with open(args['save_dir'] + '../splitwise_categories.json', 'w+') as out:
        json.dump(splitwise_categories, out)
