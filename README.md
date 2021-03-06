<p align="center"><img width="80%" src="tabpert.png" /></p>

# TabPert: An Effective Platform for Tabular Perturbation

Implementation of the semi-structured inference model in our [EMNLP 2021](https://2021.emnlp.org/) paper: [TabPert: An Effective Platform for Tabular Perturbation](https://aclanthology.org/2021.emnlp-demo.39/). To explore the dataset online visit the [project page](tabpert.github.io).

 ```
 @inproceedings{jain-etal-2021-tabpert,
    title = "{T}ab{P}ert : An Effective Platform for Tabular Perturbation",
    author = "Jain, Nupur  and
      Gupta, Vivek  and
      Rai, Anshul  and
      Kumar, Gaurav",
    booktitle = "Proceedings of the 2021 Conference on Empirical Methods in Natural Language Processing: System Demonstrations",
    month = nov,
    year = "2021",
    address = "Online and Punta Cana, Dominican Republic",
    publisher = "Association for Computational Linguistics",
    url = "https://aclanthology.org/2021.emnlp-demo.39",
    pages = "350--360",
    abstract = "To grasp the true reasoning ability, the Natural Language Inference model should be evaluated on counterfactual data. TabPert facilitates this by generation of such counterfactual data for assessing model tabular reasoning issues. TabPert allows the user to update a table, change the hypothesis, change the labels, and highlight rows that are important for hypothesis classification. TabPert also details the technique used to automatically produce the table, as well as the strategies employed to generate the challenging hypothesis. These counterfactual tables and hypotheses, as well as the metadata, is then used to explore the existing model{'}s shortcomings methodically and quantitatively.",
}
 ```
 
 ## Filestructure
 ### initial_dataset
 Contains the raw InfoTabS dataset.
 1. The `tables` folder contains the dataset to be perturbed (α<sub>1</sub> test set).
 2. The `all_data` folder contains additional tables from other parts of the InfoTabS dataset that can be used during automatic perturbation (α<sub>2</sub>, α<sub>3</sub> test sets, training set, and dev set. We only actually utilise the training set for the case study).
 ### initialisation_scripts
 Contains scripts for automatic perturbation.
 1. The `initialisation.sh` file runs the initialisation scripts in order.
 2. The `temp` folder contains files that are automatically created while running the initialisation scripts, except for `temp/key_categories/key_categories.json` which must be created by the user before starting initialisation.
 ### initialised_dataset
 Contains the InfoTabS dataset after automatic perturbation.
 ### platform
 Contains code for the TabPert platform for manual perturbation. You must have `npm` and `Flask` installed to run this code. 
 1. `api.py` contains the backend code, while the rest of the files are for the frontend.
 2. Tables and hypotheses that are perturbed manually on the platform are saved in the `output` folder.
 ### final_dataset
 Contains the perturbed InfoTabS dataset.
 
 ## Using TabPert with your own tabular dataset
 
First, replace all the files in `initial_dataset` with your own. These files must be JSON and .tsv files of the same format as those already in the folder, and having the same naming conventions.
 
 ### Initialisation
 Delete the `initialisation_scripts/temp/` folder. Then, create a folder called `initialisation_scripts/temp/key_categories`. Within this, insert your own file called `key_categories.json` in the same format as the one previously in that folder. The keys in this JSON file are the categories you want to specify for your table keys, and the value consists of an array of all the keys you want to include in this category. Note that this file is optional--if you do not wish to use this, you can create an empty JSON file instead.
 
 Now, navigate to `initialisation_scripts` and run the `falsified_tables.sh` file. Your initialised tables should soon appear in a new folder called `initialisation_scripts/initialised_tables`. Replace the tables in `initialised_dataset/json/` with these new tables. You are now ready to run the TabPert platform to manually perturb the tables.
 
 ### Manual Perturbation
 You must have `npm` and `Flask` installed on your system to use the TabPert platform. Head over to [docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm "docs.npmjs.com/downloading-and-installing-node-js-and-npm") and [pypi.org/project/Flask/](https://pypi.org/project/Flask/ "pypi.org/project/Flask/") to install these.
 
 Navigate to `platform` and  run 
 ```
 $ npm init 
 ```
 and follow the instructions. This will set up the platform for use.
 
 To open the TabPert platform on your browser, navigate to `platform` and follow these steps: 
 1. Run the `api.py` file.
 2. In a separate terminal window, run `npm start`. 
The URL `localhost:3000` should open in your browser (the latter four digits may be different--this does not affect the working of the platform). To open a table, simply enter the table number after this URL. For example: `localhost:3000/42` should open table T42. You are now ready to begin the manual perturbation. Be sure to click `Save` at the bottom of the window intermittently so you do not lose your work. All saved work is saved in `platform/output`.
 
 
### Todo
1. Add Experiments (VG)
2. Add Analysis Code (VG)
