import os
import json
import argparse
import collections
import pprintpp
import random

if __name__ == "__main__":
    dir = os.getcwd() + '/../../temp/infotabs_extension/counterfactual_tables/json/'
    for filename in os.listdir(dir):
        path = dir + filename
        file_stuff = open(path, 'r')
        contents = (
            file_stuff)
        new_contents = {}
        for key in contents:
            if key.strip() is 'title':
                continue
            values = contents[key]
            new_contents[key] = []
            for value in values:
                if isinstance(value, str):
                    continue
                new_dict = {}
                new_dict[list(value)[0]] = value[list(value)[0]] + '0'
                new_contents[key].append(new_dict)
        new_contents['title'] = contents['title']
        with open(path, 'w') as out:
            json.dump(new_contents, out)
