# TabPert
 TabPert : An Effective Platform for Tabular Perturbation
 
 ## Filestructure
 ### initial_dataset
 Contains the raw InfoTabS dataset.
 ### initialisation_scripts
 Contains scripts for automatic perturbation.
 ### initialised_dataset
 Contains the InfoTabS dataset after automatic perturbation.
 ### platform
 Contains code for the TabPert platform for manual perturbation.
 ### final_dataset
 Contains the perturbed InfoTabS dataset.
 
 ## Using TabPert with your own tabular dataset
 
First, replace all the files in `initial_dataset` with your own. These files must be JSON and .tsv files of the same format as those already in the folder, and having the same naming conventions.
 
 ### Initialisation
 Delete the `initialisation_scripts/temp/` folder. Then, create a folder called `initialisation_scripts/temp/key_categories`. Within this, insert your own file called `key_categories.json` in the same format as the one previously in that folder. The keys in this JSON file are the categories you want to specify for your table keys, and the value consists of an array of all the keys you want to include in this category. Note that this file is optional--if you do not wish to use this, you can create an empty JSON file instead.
 
 Now, navigate to `initialisation_scripts` and run the `falsified_tables.sh` file. Your initialised tables should soon appear in a new folder called `initialisation_scripts/initialised_tables`. Replace the tables in `initialised_dataset/json/` with these new tables. You are now ready to run the TabPert platform to manually perturb the tables.
 
 ### Manual Perturbation
 You must have `npm` installed on your system to use the TabPert platform. Head over to [https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm") to install.
 
 Navigate to `platform` and  run 
 $ npm init 
 and follow the instructions. This will set up the platform for use.
 
 To open the TabPert platform on your browser, navigate to `platform` and follow these steps: 
 1. Run the `api.py` file.
 2. In a separate terminal window, run `npm start`. 
The URL `localhost:3000` should open in your browser (the latter four digits may be different--this does not affect the working of the platform). To open a table, simply enter the table number after this URL. For example: `localhost:3000/42` should open table T42. You are now ready to begin the manual perturbation. Be sure to click `Save` at the bottom of the window intermittently so you do not lose your work. All saved work is saved in `platform/output`.
 
 
