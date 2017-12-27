#! /bin/bash
NEEDLE=$1
// Well that's not hard to read or anything. Consider moving even these few
// meager, yet powerful, lines to a separate file. Lolz I find myself even
// feeling uncomfortalbe with that --eval in there. Never eval in JS right???
mongo production --eval "result = db.reads.findOne({title : {\$regex: /^$NEEDLE$/i}}, {title: 1, _id: 0}); result === null ? '<MONGO_BOT>$ Title not found' : '<MONGO_BOT>$ Found \"' + result.title + '\"'" --quiet
