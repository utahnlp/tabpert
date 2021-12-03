import flask
from flask import request, jsonify
import json
import os
import sys
import re
import csv
import pandas as pd
from ast import literal_eval

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return "<h1>table1</h1>"


@app.route('/api/table/')
def get_table():
    if 'id' in request.args:
        id = request.args['id']
    else:
        return "Error: No table id provided"
    # save_dir = os.cwd() + '/../../data/infotabs_extension/refined'
    # TODO: remove next line and replace with previous line
    save_dir = os.curdir + '/output'
    new_json = {}

    original_hypotheses_filename = os.curdir + \
        '/../initial_dataset/hypotheses.tsv'
    df = pd.read_csv(original_hypotheses_filename,
                     delimiter="\t", encoding='utf-8')
    original_rows = df.loc[df['table_id'] == ('T' + id)]
    original_hypotheses = {row['hypothesis']: row['label']
                           for idx, row in original_rows.iterrows()}
    new_json['oh'] = original_hypotheses

    # if the table has already been worked on before
    if (os.path.isfile(save_dir + '/tables/T' + id + 'A.json')):
        counter_table_dir = str(save_dir + '/tables/T' + id)

        new_hypotheses_filename = str(save_dir + '/hypotheses/T' + id + '.tsv')
        df = pd.read_csv(new_hypotheses_filename,
                         delimiter="\t", dtype=str,encoding='utf-8')
        a_rows = df.loc[df['table_id'] == ('T' + id + 'A')]
        b_rows = df.loc[df['table_id'] == ('T' + id + 'B')]
        c_rows = df.loc[df['table_id'] == ('T' + id + 'C')]
        new_json['ah'] = {row['hypothesis']: [row['label'], row['strategies'], literal_eval(row['table_rows']), idx]
                          for idx, row in a_rows.iterrows()}
        new_json['bh'] = {row['hypothesis']:  [row['label'], row['strategies'], literal_eval(row['table_rows']), idx]
                          for idx, row in b_rows.iterrows()}
        new_json['ch'] = {row['hypothesis']:  [row['label'], row['strategies'], literal_eval(row['table_rows']), idx]
                          for idx, row in c_rows.iterrows()}
        print(new_json, file=sys.stdout)
    else:
        counter_table_dir = str(
            os.curdir + '/../initialised_dataset/json/T' + id)
        new_json['ah'] = {original_hypothesis: [original_hypotheses[original_hypothesis], '000000', [], idx] for idx, original_hypothesis in enumerate(original_hypotheses)}
        new_json['bh'] = {original_hypothesis: [original_hypotheses[original_hypothesis], '000000', [], idx] for idx, original_hypothesis in enumerate(original_hypotheses)}
        new_json['ch'] = {original_hypothesis: [original_hypotheses[original_hypothesis], '000000', [], idx] for idx, original_hypothesis in enumerate(original_hypotheses)}


    # get tables
    original_table_file = open(os.path.join(os.path.dirname(
        __file__), './../initial_dataset/tables/json/', 'T' + id + '.json'), 'r')
    table_A_file = open(counter_table_dir + 'A.json', 'r')
    table_B_file = open(counter_table_dir + 'B.json', 'r')
    table_C_file = open(counter_table_dir + 'C.json', 'r')

    original_table = json.load(original_table_file)
    table_A = json.load(table_A_file)
    table_B = json.load(table_B_file)
    table_C = json.load(table_C_file)

    new_json['title'] = original_table['title']
    del original_table['title']
    del table_A['title']
    del table_B['title']
    del table_C['title']
    print(table_A, file=sys.stdout)

    new_json['original'] = original_table
    new_json['A'] = table_A
    new_json['B'] = table_B
    new_json['C'] = table_C
    return(new_json)


@app.route('/api/cats')
def key_cats():
    data_file = os.curdir + \
        '/../initialisation_scripts/temp/reversed_key_categories/reversed_key_categories.json'
    cat_file = open(data_file, 'r')
    key_cats = json.load(cat_file)
    return(key_cats)


@app.route('/api/save', methods=['POST'])
def save_tables():
    data = request.get_json()
    print(data, file=sys.stdout)

    save_dir = os.curdir
    tables_dir = save_dir + '/tables/T' + data['id']
    hypotheses_file = save_dir + '/hypotheses/T' + data['id'] + '.tsv'

    # save tables
    with open(tables_dir + 'A' + '.json', 'w+') as out:
        json.dump(data['A'], out)
    with open(tables_dir + 'B' + '.json', 'w+') as out:
        json.dump(data['B'], out)
    with open(tables_dir + 'C' + '.json', 'w+') as out:
        json.dump(data['C'], out)

    # save hypotheses
    with open(hypotheses_file, 'w+') as out:
        writer = csv.writer(out, delimiter='\t')
        writer.writerow(['table_id', 'hypothesis', 'label', 'strategies', 'table_rows'])
        for hyp, hyp_info in data['ah'].items():
            writer.writerow(['T' + data['id'] + 'A', hyp, hyp_info[0], hyp_info[1], hyp_info[2]])
        for hyp, hyp_info in data['bh'].items():
            writer.writerow(['T' + data['id'] + 'B', hyp, hyp_info[0], hyp_info[1], hyp_info[2]])
        for hyp, hyp_info in data['ch'].items():
            writer.writerow(['T' + data['id'] + 'C', hyp, hyp_info[0], hyp_info[1], hyp_info[2]])
    return("Success")


if __name__ == '__main__':
    app.run(debug=True)
