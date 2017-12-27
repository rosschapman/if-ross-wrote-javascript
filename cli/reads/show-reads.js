#! /bin/bash
mongo production --eval "db.reads.distinct('title').join(', \n')" --quiet | tail +1
