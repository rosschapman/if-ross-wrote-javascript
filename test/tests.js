const {assert, expect} = require('chai');
const RDocument = require('./../rdocument');

describe('RDocument', function() {
  describe('#isValid()', function() {
  	const schema = {
			propA: {
				type: String,
				isRequired: true
			},
			propB: {
				type: Object,
				isRequired: true,
			},
			propC: {
				type: Number
			}
		}
		const badData = {}
		const goodData = {
			propA: 'fake-string',
			propB: {},
			propC: Date.now()
		}
		const badRecord = new RDocument(null, badData, {validations: schema});
		const goodRecord = new RDocument(null, goodData, {validations: schema});

		it('should be invalid', function() {
			expect(badRecord.isValid()).to.be.false;
		});

		it('should be valid', function() {
			expect(goodRecord.isValid()).to.be.true;
		});
  });
});