#!/bin/sh
# pandoc cahier-des-charges.org --metadata-file=metadata.yaml --template eisvogel --number-sections -s -o cahier-des-charges.pdf
pandoc dossier-de-conception.org --metadata-file=metadata-conception.yaml --template eisvogel --number-sections -s -o dossier-de-conception.pdf
