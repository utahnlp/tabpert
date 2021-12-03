#!/bin/bash
# before running this script, create a folder called initialisation_scripts/temp/reversed_category_keys. Within this, insert your key_categories.json file as indicated in the README.

mkdir -p ./temp/category_keys
python3 category_keys.py

mkdir -p ./temp/reversed_category_keys
python3 reversed_category_keys.py

mkdir -p ./temp/reversed_key_categories
python3 reversed_key_categories.py

mkdir -p ./temp/swap_lists
python3 create_swap_lists.py


python3 create_counterfactual_tables.py
