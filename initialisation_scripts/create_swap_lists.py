import os
import json
import argparse
import collections
import random


def config(parser):
    parser.add_argument('--data_dir', default=os.getcwd() +
                        '/temp/category_keys/', type=str)
    parser.add_argument('--reversed_file', default=os.getcwd() +
                        '/temp/reversed_key_categories/reversed_key_categories.json', type=str)
    parser.add_argument('--tables_dir', default=os.getcwd() +
                        '/../initial_dataset/all_data/tables/', type=str)
    parser.add_argument('--key_categories_file', default=os.getcwd() +
                        '/temp/key_categories/key_categories.json', type=str)
    parser.add_argument('--save_dir', default=os.getcwd() +
                        '/temp/swap_lists/', type=str)
    parser.add_argument(
        '--reversed_dir', default=os.getcwd() + "/temp/reversed_category_keys/", type=str)
    parser.add_argument(
        '--swap_all_dir', default=os.getcwd() + "/temp/swap_all/", type=str)
    parser.add_argument(
        '--swap_dir', default=os.getcwd() + "/temp/swap/", type=str)
    parser.add_argument(
        '--swap_all_other_dir', default=os.getcwd() + "/temp/swap_all_other/", type=str)
    parser.add_argument(
        '--swap_other_dir', default=os.getcwd() + "/temp/swap_other/", type=str)
    parser.add_argument(
        '--splits', default=["train", "test_alpha1"], type=str, nargs='*')
    parser.add_argument('--lower_threshold', default=5, type=int)
    parser.add_argument('--upper_threshold', default=20, type=int)
    parser.add_argument('--perc', default=20, type=int)
    return parser

"""
A swap list is used during the initial automatic perturbation. It contains, for each key category, a list of all values that can be "swapped" with other values in that key category.
We have three kinds of swap lists, with a different function for each:
    1) create_all_swap(): for each split, for each table category, creates a separate file containing the swap list for that category in that split.
    2) create_other_swap_all(): for each split, for each table category, combines values from the same key category from other table category files within the same split to create an "other category" swap list
    3) create_swap(): condenses the files output from each of create_all_swap() and create_other_swap_all(), randomly sampling values from large lists to create smaller lists so that there is some degree of overlap in the perturbed tables
"""



"""
for each split
    for each category
        for each key category
            creates a swap list with all values
"""

def create_all_swap(swap_all_dir, data_dir, reversed_file, key_categories_file, tables_dir):
    splits = ['train', 'test_alpha1']
    rev_file = open(reversed_file, 'r')
    reversed_key_categories = json.load(
        rev_file, object_pairs_hook=collections.OrderedDict)
    key_cats_file = open(key_categories_file, 'r')
    key_categories = json.load(key_cats_file)
    os.mkdir(swap_all_dir)

    for split in splits:
        data_file = open(data_dir + split + '_keys.json', 'r')
        os.mkdir(swap_all_dir + split)
        category_info = json.load(
            data_file, object_pairs_hook=collections.OrderedDict)
        save_path = swap_all_dir + split + '/'
        for category in category_info:
            output = {key_category: [] for key_category in key_categories}
            keys = category_info[category]['keys']
            for key in keys:
                if not key in reversed_key_categories:
                    continue
                key_cat = reversed_key_categories[key]
                tables = keys[key]['tables']
                for table in tables:
                    table_file = open(tables_dir + table + '.json', 'r')
                    table_contents = json.load(table_file)
                    for value in table_contents[key]:
                        output[key_cat].append(value)
            for key_cat in output:
                output[key_cat] = list(set(output[key_cat]))
            safe_category = category.replace('/', '_')
            with open(save_path + safe_category + '.json', 'w') as out:
                json.dump(output, out)



"""
for each file created by create_swap()
    create 'other category' files
"""

def create_other_swap_all(swap_dir, swap_all_other_dir):
    splits = ['train', 'test_alpha1']
    os.mkdir(swap_all_other_dir)
    for split in splits:
        dir = swap_dir + split + '/'
        out_dir = swap_all_other_dir + split + '/'
        os.mkdir(out_dir)
        for filename in os.listdir(dir):
            path = dir + filename
            data_file = open(path, 'r')
            data = json.load(data_file)
            output = {key_category: [] for key_category in data}
            for other_filename in os.listdir(dir):
                if filename is other_filename:
                    continue
                other_path = dir + other_filename
                other_data_file = open(other_path, 'r')
                other_data = json.load(other_data_file)
                for key_category in other_data:
                    output[key_category].extend(other_data[key_category])
            for key_cat in output:
                output[key_cat] = list(set(output[key_cat]))
            with open(out_dir + filename, 'w') as out:
                json.dump(output, out)
            


"""
for each file created by the create_all_swap (swap lists with all values)
    create a condensed swap list
"""

def create_swap(swap_all_dir, swap_dir, lower_threshold, upper_threshold, perc):
    splits = ['train', 'test_alpha1']
    os.mkdir(swap_dir)
    for split in splits:
        dir = swap_all_dir + split + '/'
        out_dir = swap_dir + split + '/'
        os.mkdir(out_dir)
        for filename in os.listdir(dir):
            path = dir + filename
            data_file = open(path, 'r')
            data = json.load(data_file)
            output = {}
            for key_category in data:
                num = len(data[key_category])
                if num > lower_threshold:
                    out_num = min(max(lower_threshold, int(
                        perc / 100 * num)), upper_threshold)
                    swap = random.sample(data[key_category], out_num)
                    output[key_category] = swap
                else:
                    swap = data[key_category]
                    output[key_category] = swap
            with open(out_dir + filename, 'w') as out:
                json.dump(output, out)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser = config(parser)
    args = vars(parser.parse_args())
    create_all_swap(args['swap_all_dir'], args['data_dir'], args['reversed_file'],
                    args['key_categories_file'], args['tables_dir'])
    create_swap(args['swap_all_dir'], args['swap_dir'],
                args['lower_threshold'], args['upper_threshold'], args['perc'])
    create_other_swap_all(args['swap_dir'], args['swap_all_other_dir'])
    create_swap(args['swap_all_other_dir'], args['swap_other_dir'],
                args['lower_threshold'], args['upper_threshold'], args['perc'])
