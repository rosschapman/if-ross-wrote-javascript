#! /bin/bash
NEEDLE=$1
mongo production --eval "result = db.reads.findOne({title : {\$regex: /^$NEEDLE$/i}}, {title: 1, _id: 0}); result === null ? '<MONGO_BOT>$ Title not found' : '<MONGO_BOT>$ Found \"' + result.title + '\"'" --quiet
