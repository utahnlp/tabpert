import os
import json
import argparse
import collections
import pprintpp
import random
from bs4 import BeautifulSoup


def config(parser):
    parser.add_argument('--data_dir', default=os.getcwd() +
                        '/../../temp/infotabs_extension/category_keys/', type=str)
    parser.add_argument('--reversed_file', default=os.getcwd() +
                        '/../../temp/infotabs_extension/reversed_key_categories/reversed_key_categories.json', type=str)
    parser.add_argument('--tables_dir', default=os.getcwd() +
                        '/../../data/tables/json/', type=str)
    parser.add_argument('--key_categories_file', default=os.getcwd() +
                        '/../../temp/infotabs_extension/key_categories/key_categories.json', type=str)
    parser.add_argument('--save_dir', default=os.getcwd() +
                        '/../../temp/infotabs_extension/counterfactual_tables/', type=str)
    parser.add_argument(
        '--reversed_dir', default=os.getcwd() + "/../../temp/infotabs_extension/reversed_category_keys/", type=str)
    parser.add_argument(
        '--swap_all_dir', default=os.getcwd() + "/../../temp/infotabs_extension/swap_all/", type=str)
    parser.add_argument(
        '--swap_dir', default=os.getcwd() + "/../../temp/infotabs_extension/swap/", type=str)
    parser.add_argument(
        '--swap_all_other_dir', default=os.getcwd() + "/../../temp/infotabs_extension/swap_all_other/", type=str)
    parser.add_argument(
        '--swap_other_dir', default=os.getcwd() + "/../../temp/infotabs_extension/swap_other/", type=str)
    parser.add_argument(
        '--json_dir', default="./../../data/tables/json/", type=str)
    parser.add_argument(
        '--html_dir', default="./../../data/tables/html/", type=str)
    parser.add_argument(
        '--for_split', default="test_alpha1", type=str)
    parser.add_argument(
        '--use_splits', default=["test_alpha1", "train"], type=str, nargs="*")
    return parser


"""
Performs the initial automatic perturbation to create counterfactual tables.
These automatically perturbed tables are used as input into the TabPert platform to manually perform perturbations.
"""


"""
given a split, a category, a key
return a random table
"""


def choose_table(split, category, key, data_dir, table):
    file = open(data_dir + split + '_keys.json', 'r')
    info = json.load(file, object_pairs_hook=collections.OrderedDict)
    if key not in info[category]['keys']:
        return None
    tables = info[category]['keys'][key]['tables']
    if table in tables:
        tables.remove(table)
    if tables:
        table_choice = random.choice(tables)
        return table_choice
    return None


"""
given a key
return its key category
"""


def lookup_keycat(key, reversed_file):
    file = open(reversed_file, 'r')
    info = json.load(file, object_pairs_hook=collections.OrderedDict)
    if key in info:
        return info[key]
    return None


"""
given a key
if more than one category exists for the key
return a random category
"""


def diff_category(key, split, category, reversed_dir):
    file = open(reversed_dir + split + '_reversed_keys.json', 'r')
    info = json.load(file, object_pairs_hook=collections.OrderedDict)
    if key not in info:
        return None
    categories = info[key]
    if category in categories:
        categories.remove(category)
    if categories:
        return random.choice(categories)
    return None


"""
given a key category and a key
return a different random key
"""


def diff_category_diff_key(key_category, key, key_categories_file):
    file = open(key_categories_file, 'r')
    info = json.load(file, object_pairs_hook=collections.OrderedDict)
    keys = info[key_category]
    keys.remove(key)
    return random.choice(keys)


"""
given a key category and a category
return a random key
"""


def same_category_diff_key(category, key_category, split, reversed_file, data_dir):
    cats_file = open(data_dir + split + '_keys.json', 'r')
    cats_info = json.load(cats_file, object_pairs_hook=collections.OrderedDict)
    key_cats_file = open(reversed_file, 'r')
    key_cats = json.load(
        key_cats_file, object_pairs_hook=collections.OrderedDict)
    keys = list(cats_info[category]['keys'].keys())
    random.shuffle(keys)
    for key in keys:
        if key not in key_cats:
            continue
        if key_cats[key] is key_category:
            return key
    return None


"""
given a table and a key
return a different key from the same table
"""


def same_table(table_contents, key, reversed_file):
    rev_file = open(reversed_file, 'r')
    reversed_key_cats = json.load(
        rev_file, object_pairs_hook=collections.OrderedDict)
    if key not in reversed_key_cats:
        return None
    key_cat = reversed_key_cats[key]
    key_choices = []
    for other_key in table_contents:
        if other_key is key or other_key not in reversed_key_cats:
            continue

        other_key_cat = reversed_key_cats[other_key]
        if key_cat is other_key_cat:
            key_choices.append(other_key)
    if key_choices:
        key_choice = random.choice(key_choices)
        return key_choice


"""
given a key and a table
return a random value from that key in the table
"""


def random_value(key, table, tables_dir):
    table_contents_file = open(
        tables_dir + table + '.json', 'r')
    table_contents = json.load(
        table_contents_file, object_pairs_hook=collections.OrderedDict)
    value_choice = random.choice(table_contents[key])
    return value_choice


"""
given a key and a split
return a category the key appears in
"""


def lookup_catkey(split, key, reversed_dir):
    rev_file = open(reversed_dir + split + '_reversed_keys.json', 'r')
    reversed_cat_keys = json.load(
        rev_file, object_pairs_hook=collections.OrderedDict)
    if key in reversed_cat_keys:
        categories = reversed_cat_keys[key]
        category_choice = random.choice(categories)
        return category_choice
    return None


"""
implement function set for same category, different key
return key, table
"""


def split_same_diff(split, key, category, table, reversed_file, data_dir):
    key_category = lookup_keycat(key, reversed_file)
    if not key_category:
        return None, None
    key_choice = same_category_diff_key(
        category, key_category, split, reversed_file, data_dir)
    if key_choice:
        table_choice = choose_table(
            split, category, key_choice, data_dir, table)
        return key_choice, table_choice
    return None, None


"""
implement function set for different category, different key
return key, table
"""


def split_diff_diff(split, key, category, table, reversed_file, reversed_dir, data_dir, key_categories_file):
    key_category = lookup_keycat(key, reversed_file)
    if not key_category:
        return None, None
    for i in range(1, 30):
        key_choice = diff_category_diff_key(
            key_category, key, key_categories_file)
        category_key_choice = lookup_catkey(split, key_choice, reversed_dir)
        if category_key_choice:
            if category_key_choice is category:
                continue
            table_choice = choose_table(
                split, category_key_choice, key_choice, data_dir, table)
            return key_choice, table_choice
    return None, None


"""
implement function set for different category, same key
return table
"""


def split_diff_same(split, key, category, table, reversed_dir, data_dir):
    category_choice = diff_category(key, split, category, reversed_dir)
    if category_choice:
        table_choice = choose_table(
            split, category_choice, key, data_dir, table)
        return table_choice
    return None


if __name__ == "__main__":
    # TODO: pick values from swap lists to generate 3 tables
    # priority: other category, same table, same category
    parser = argparse.ArgumentParser()
    parser = config(parser)
    args = vars(parser.parse_args())
    split = args['for_split']
    other_split = 'train'
    category_tables_file = open(
        args['data_dir'] + args['for_split'] + '_keys.json', 'r')
    category_tables = json.load(
        category_tables_file, object_pairs_hook=collections.OrderedDict)

    for category in category_tables:
        safe_category = category.replace('/', '_')

        swap_same_split_file = open(
            args['swap_dir'] + split + '/' + safe_category + '.json', 'r')
        swap_diff_split_file = open(
            args['swap_dir'] + other_split + '/' + safe_category + '.json', 'r')
        swap_other_same_split_file = open(
            args['swap_other_dir'] + split + '/' + safe_category + '.json', 'r')
        swap_other_diff_split_file = open(
            args['swap_other_dir'] + other_split + '/' + safe_category + '.json', 'r')

        swap_same_split = json.load(
            swap_same_split_file, object_pairs_hook=collections.OrderedDict)
        swap_diff_split = json.load(
            swap_diff_split_file, object_pairs_hook=collections.OrderedDict)
        swap_other_same_split = json.load(
            swap_other_same_split_file, object_pairs_hook=collections.OrderedDict)
        swap_other_diff_split = json.load(
            swap_other_diff_split_file, object_pairs_hook=collections.OrderedDict)

        tables = category_tables[category]['tables']

        for table in tables:
            table_contents_file = open(
                args['tables_dir'] + table + '.json', 'r')
            table_contents = json.load(
                table_contents_file, object_pairs_hook=collections.OrderedDict)
            title = table_contents['title']
            del table_contents['title']
            for index in ['A', 'B', 'C']:
                new_table = {key: [] for key in table_contents}
                new_table['title'] = title

                for key in table_contents:
                    for value in table_contents[key]:
                        local_swap = {}
                        key_cat = lookup_keycat(key, args['reversed_file'])
                        # same split
                        #   same category
                        #       same table, different key
                        key_choice = same_table(
                            table_contents, key, args['reversed_file'])
                        if key_choice:
                            local_swap['0001'] = random_value(
                                key_choice, table, args['tables_dir'])
                        #       same key
                        table_choice = choose_table(
                            split, category, key, args['data_dir'], table)
                        if table_choice:
                            local_swap['0010'] = random_value(
                                key, table_choice, args['tables_dir'])
                        #       different key
                        key_choice, table_choice = split_same_diff(split, key_choice, category, table_choice,
                                                                   args['reversed_file'], args['data_dir'])
                        if table_choice:
                            local_swap['0011'] = random_value(
                                key_choice, table_choice, args['tables_dir'])
                        #   different category
                        #       same key
                        table_choice = split_diff_same(
                            split, key, category, table, args['reversed_dir'], args['data_dir'])
                        if table_choice:
                            local_swap['0110'] = random_value(
                                key, table_choice, args['tables_dir'])
                        #       different key
                        key_choice, table_choice = split_diff_diff(
                            split, key, category, table, args['reversed_file'], args['reversed_dir'], args['data_dir'], args['key_categories_file'])
                        if table_choice:
                            local_swap['0111'] = random_value(
                                key_choice, table_choice, args['tables_dir'])
                        # different split
                        #   same category
                        #       same key
                        table_choice = choose_table(
                            other_split, category, key, args['data_dir'], table)
                        if table_choice:
                            local_swap['1010'] = random_value(
                                key, table_choice, args['tables_dir'])
                        #       different key
                        key_choice, table_choice = split_same_diff(other_split, key, category, table,
                                                                   args['reversed_file'], args['data_dir'])
                        if table_choice:
                            local_swap['1011'] = random_value(
                                key_choice, table_choice, args['tables_dir'])
                        #   different category
                        #       same key
                        table_choice = split_diff_same(
                            other_split, key, category, table, args['reversed_dir'], args['data_dir'])
                        if table_choice:
                            local_swap['1110'] = random_value(
                                key, table_choice, args['tables_dir'])
                        #       different key
                        key_choice, table_choice = split_diff_diff(
                            other_split, key, category, table, args['reversed_file'], args['reversed_dir'], args['data_dir'], args['key_categories_file'])
                        if table_choice:
                            local_swap['1111'] = random_value(
                                key_choice, table_choice, args['tables_dir'])

                        new_value = {value: '0000'}
                        if local_swap:
                            if random.uniform(0, 1) < 0.8:
                                new_value_dict = random.choice(
                                    list(local_swap.keys()))
                                final_new_value_dict = new_value_dict + '00'
                                new_value = {
                                    local_swap[new_value_dict]: final_new_value_dict}
                        new_table[key].append(new_value)
                with open(args['save_dir'] + 'json/' + table + index + '.json', 'w') as out:
                    json.dump(new_table, out)
