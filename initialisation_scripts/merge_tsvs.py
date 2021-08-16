import os
# from typing import OrderedDict
from collections import OrderedDict
import pandas as pd
import numpy as np
import pprintpp
import csv
import json
import sys
import os
import requests
import re,csv
import json
import numpy as np
import collections


"""
Using Word Mover's Distance, 'matches up' counterfactual hypotheses to their corresponding 'closest' original hypotheses within the same table set
"""


# def get_distances():
#     arr = []
#     with open('distances.txt') as f:
#         arr = f.readlines()
#     nums = [float(item.strip()) for item in arr]
#     intermediate_arr = [nums[i:i+81] for i in range(0, len(nums), 81)]
#     final_arr = [[table[i:i+9] for i in range(0, 81, 9)] for table in intermediate_arr]
#     return final_arr

def create_distance_matrix(counterfactual_hypotheses_dict, original_hypotheses_dict, distances_dict):
    distance_matrix = [[0 for i in range(9)] for j in range(9)]
    for c_idx, counterfactual_hypothesis_set in counterfactual_hypotheses_dict.items():
        counterfactual_hypothesis = counterfactual_hypothesis_set['hypothesis']
        for o_idx, original_hypothesis_set in original_hypotheses_dict.items():
            original_hypothesis = original_hypothesis_set['hypothesis']
            distance_matrix[c_idx % 9][o_idx] = distances_dict[counterfactual_hypothesis][original_hypothesis]
    return np.array(distance_matrix)


def pad_bits(strategies):
    strategies = str(int(strategies))
    while len(strategies) != 6:
        strategies = '0' + strategies
    return strategies

def preprocess(sentence):
    sentence = sentence.lower().split()
    sentence = [w for w in sentence if w not in stop_words]
    return sentence

if __name__ == "__main__":

    with open('merged_hypotheses.tsv', 'w') as outfile:
        writer = csv.writer(outfile,delimiter='\t')
        header = ['table_id', 'distance', 'counterfactual_hypothesis', 'counterfactual label', 'original_hypothesis', 'original_label', 'strategies', 'counterfactual_table_rows']
        writer.writerow(header)
    with open('logs.txt', 'w') as outfile:
        outfile.write("")
    
    distances_file = open('new_distances.json', 'r')
    distances = json.load(
        distances_file, object_pairs_hook=collections.OrderedDict)

    # these are tables that have a problem in output.tsv (missing strategies). we skip them
    problem_tables = {'947': 3}

    # open and extract counterfactual table hypotheses (1-3 sets)
    counterfactual_filename = "./../../interface/apis/hypotheses/output.tsv"
    counterfactual_df = pd.read_csv(counterfactual_filename, delimiter = "\t", encoding='utf-8')

    table_ids = list(OrderedDict.fromkeys(counterfactual_df['table_id'].str[1:-1].tolist()))
    triplet = ['A', 'B', 'C']
    table_index = 0

    for table_index, id in enumerate(table_ids):

        if id in problem_tables:
            table_index = table_index + problem_tables[id]
            continue
        counterfactual_rows = {letter: counterfactual_df.loc[counterfactual_df['table_id'] == ('T' + id + letter)] for letter in triplet}
        first_index = int(counterfactual_rows['A'].iloc[0].name)
        counterfactual_hypotheses = {letter: {idx - first_index: {'hypothesis': row['hypothesis'], 'label': row['label'], 'strategies': pad_bits(row['strategies']), 'rows': row['table_rows']} for idx, row in counterfactual_rows[letter].iterrows()} for letter in triplet}
        # print(counterfactual_hypotheses)

        # open and extract corresponding original hypotheses
        original_filename = os.getcwd() + "/../../data/maindata/infotabs_test_alpha1.tsv"
        original_df = pd.read_csv(original_filename, delimiter = "\t", encoding='utf-8')
        original_rows = original_df.loc[original_df['table_id'] == ('T' + id)]
        first_index = int(original_rows.iloc[0].name)
        original_hypotheses = {idx - first_index: {'hypothesis': row['hypothesis'], 'label': row['label']} for idx, row in original_rows.iterrows()}

        # print(id)

        # run wmd on data

        distance_table_dict = {}
        for letter_index, letter in enumerate(triplet):
            print(letter)
            # distance_matrix = np.array(distances[table_index * 3 + letter_index])
            # pprintpp.pprint(counterfactual_hypotheses)

            # distance_arr = [[0 for i in range(9)] for j in range(9)]

            # distance_letter_dict = {}
            # for c_idx, counterfactual_set in counterfactual_hypotheses[letter].items():
            #     counterfactual_hypothesis = preprocess(counterfactual_set['hypothesis'])
            #     distance_counterfactual_hypothesis_dict = {}
            #     for o_idx, original_set in original_hypotheses.items():
            #         original_hypothesis = preprocess(original_set['hypothesis'])
            #         distance = (model.wmdistance(counterfactual_hypothesis, original_hypothesis) + model.wmdistance(original_hypothesis,counterfactual_hypothesis))/2.00000 # TODO: need wmd between counterfactual_hypotehsis and original_hypothesis
            #         distance_counterfactual_hypothesis_dict[original_set['hypothesis']] = distance
            #     distance_letter_dict[counterfactual_set['hypothesis']] = distance_counterfactual_hypothesis_dict
            # distance_table_dict[letter] = distance_letter_dict


            
            distance_matrix = create_distance_matrix(counterfactual_hypotheses[letter], original_hypotheses, distances[id][letter])
            pprintpp.pprint(distance_matrix)

            # print(distance_matrix)
            reduced_distance_matrix = distance_matrix
            # print("max is ", np.max(distance_matrix))
            # print("min is ", np.min(distance_matrix))
            print(np.min(distance_matrix))
            if not counterfactual_hypotheses[letter] or (np.min(distance_matrix) == 0.0 and np.max(distance_matrix) == 0.0):
                if not counterfactual_hypotheses[letter] and (np.min(distance_matrix) == 0.0 and np.max(distance_matrix) == 0.0):
                    with open('logs.txt', 'at') as outfile:
                        data = id + letter + " has no " + letter + " AND distance matrix is 0\n"
                        outfile.write(data)
                elif not counterfactual_hypotheses[letter]:
                    with open('logs.txt', 'at') as outfile:
                        data = id + letter + " has no " + letter + "\n"
                        outfile.write(data)
                elif (np.min(distance_matrix) == 0.0 and np.max(distance_matrix) == 0.0):
                    with open('logs.txt', 'at') as outfile:
                        data = id + letter + " distance matrix is 0\n"
                        outfile.write(data)
                continue


            reduced_distance_matrix = distance_matrix
            location_matrix = [[(i,j) for j in range(9)] for i in range(9)]
            for i in range(9):
                min_distance = np.min(reduced_distance_matrix)
                min_distance_location_row = np.where(reduced_distance_matrix == min_distance)[0][0]
                min_distance_location_column = np.where(reduced_distance_matrix == min_distance)[1][0]
                print("location is", min_distance_location_row, min_distance_location_column)
                actual_location = location_matrix[min_distance_location_row][min_distance_location_column]
                # min_indices = np.where(distance_matrix == min_distance)
                # reduced_min_indices = np.where(reduced_distance_matrix == min_distance)
                # print(min_indices)
                row = actual_location[0]
                column = actual_location[1]
                print(row, column)
                print(min_distance)
                print(row + 9 * letter_index)

                # pprintpp.pprint(counterfactual_hypotheses[letter])
                print(counterfactual_hypotheses[letter][row + 9 * letter_index])
                counterfactual_set = counterfactual_hypotheses[letter][row + 9 * letter_index]
                original_set = original_hypotheses[column]
                with open('merged_hypotheses.tsv', 'at') as outfile:
                    writer = csv.writer(outfile,delimiter='\t')
                    data = ['T' + id + letter, min_distance, counterfactual_set['hypothesis'], counterfactual_set['label'], original_set['hypothesis'], original_set['label'], counterfactual_set['strategies'], counterfactual_set['rows']]
                    writer.writerow(data)
                reduced_distance_matrix = np.delete(reduced_distance_matrix, min_distance_location_row, axis=0)
                reduced_distance_matrix = np.delete(reduced_distance_matrix, min_distance_location_column, axis=1)
                location_matrix = np.delete(location_matrix, min_distance_location_row, axis=0)
                location_matrix = np.delete(location_matrix, min_distance_location_column, axis=1)
                pprintpp.pprint(reduced_distance_matrix)

        