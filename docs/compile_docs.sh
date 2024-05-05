#!/bin/sh
pandoc cahier-des-charges.org --metadata-file=metadata.yaml --template eisvogel --number-sections -s -o cahier-des-charges.pdf
