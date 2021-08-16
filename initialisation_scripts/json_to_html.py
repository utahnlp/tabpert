from collections import OrderedDict
import pandas as pd
import json
import os
import csv
from shutil import copyfile
import json
import collections
from json2html import *


"""
Converts tables in JSON format to HTML format
"""
if __name__ == "__main__":

    hypotheses_filename = "./merged_hypotheses.tsv"
    table_ids = list(OrderedDict.fromkeys(pd.read_csv(hypotheses_filename, delimiter='\t', encoding='utf-8')['table_id'].tolist()))

    tables_folder = '../../interface/apis/tables/'
    original_tables_folder = "../../data/tables/html/"
    output_folder = './turk_tables/'
    begin_string = "<table border=\"1\">"
    begin_replace = "<table border=\"1\"><tr><th colspan=\"2\"style=\"text-align: center;font-size: 125%;font-weight: bold;font-size: 110%;font-style: italic;\">"
    end_replace = "</th></tr>"

    original_table_ids = []

    for id in table_ids:
        original_table_ids.append(id[:-1])
        table_filename = tables_folder + id + '.json'
        table_file = open(table_filename, 'r')
        table_unprocessed = dict(json.load(table_file, object_pairs_hook=collections.OrderedDict))
        # pprintpp.pprint(table_unprocessed)
        title = table_unprocessed['title']
        del table_unprocessed['title']
        final_table = {}
        for key in table_unprocessed:
            values_with_metadata = table_unprocessed[key]
            values_array = []
            for value in values_with_metadata:
                for value_ in value:
                    values_array.append(value_)
            final_table[key] = values_array
        with open(output_folder + id + '.html', 'w') as outfile:
            final_out = json2html.convert(json = final_table).replace(begin_string, begin_replace + title[0] + end_replace)
            outfile.write(final_out)
    for id in original_table_ids:
        copyfile(original_tables_folder + id + '.html', output_folder + id + '.html')

        





   