import os
import json
import argparse
import collections
import pprintpp
import random


def config(parser):
    parser.add_argument('--data_dir', default=os.getcwd() +
                        '/../../temp/infotabs_extension/category_keys/', type=str)
    parser.add_argument('--tables_dir', default=os.getcwd() +
                        '/../../data/tables/json/', type=str)
    parser.add_argument('--save_dir', default=os.getcwd() +
                        '/../../temp/infotabs_extension/reversed_category_keys/', type=str)
    parser.add_argument(
        '--splits', default=["train", "dev", "test_alpha1", "test_alpha2", "test_alpha3"], type=str, nargs="*")
    return parser

'''
For all the keys in a split, creates a list of all the table categories that contain that key
'''

if __name__ == "__main__":
    # priority: 1) other category, 2) same table, 3) same category
    parser = argparse.ArgumentParser()
    parser = config(parser)
    args = vars(parser.parse_args())

    for split in args['splits']:
        # this is the file with all the data about the key in each category
        split_category_keys_file = open(
            args['data_dir'] + split + '_keys.json', 'r')
        split_category_keys = json.load(split_category_keys_file)

        reversed_category_keys = {}
        for category in split_category_keys:
            for key in split_category_keys[category]['keys'].keys():
                if key not in reversed_category_keys.keys():
                    reversed_category_keys[key] = []
                reversed_category_keys[key].append(category)

        with open(args['save_dir'] + split + '_reversed_keys.json', 'w+') as out:
            json.dump(reversed_category_keys, out)
