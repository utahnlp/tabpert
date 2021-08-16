import os
import json
import argparse
import collections
import random


def config(parser):
    parser.add_argument('--key_categories_file', default=os.getcwd() +
                        '/../../temp/infotabs_extension/key_categories/key_categories.json', type=str)
    parser.add_argument('--save_dir', default=os.getcwd() +
                        '/../../temp/infotabs_extension/reversed_key_categories/', type=str)
    return parser

'''
Reverses the key_categories/key_categories.json file and outputs in the format {key: key category}
'''

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser = config(parser)
    args = vars(parser.parse_args())

    reversed_key_categories = {}

    json_file = open(args['key_categories_file'], 'r')
    key_categories = json.load(
        json_file, object_pairs_hook=collections.OrderedDict)

    for key_category in key_categories:
        keys = key_categories[key_category]
        for key in keys:
            reversed_key_categories[key] = key_category
    with open(args['save_dir'] + 'reversed_key_categories.json', 'w+') as out:
        json.dump(reversed_key_categories, out)
