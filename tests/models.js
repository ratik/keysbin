var assert = require("assert");
var userModel = require('./../models/user.js').i();
var permissionModel = require('./../models/permission.js').i();
var dataModel = require('./../models/data.js').i();
var expect = require('chai').expect;
var openpgp = require('openpgp');

var k = (new Date().getTime()) + '@test.com';
var pass = new Date().getTime();
var puK = null;
var pvK = null;

describe('UserModel', function() {
    before(function(done) {
        var opt = {
            numBits: 512,
            userId: k,
            passphrase: pass
        };
        userModel.on('open', function(err, db) {
            openpgp.generateKeyPair(opt).then(function(key) {
                puK = key.publicKeyArmored;
                prK = key.privateKeyArmored;
                done();
            });
        });
    });
    it('add user', function(done) {
        userModel.add(k, puK, prK, done);
    });
    it('should fail on dups', function(done) {
        userModel.add(k, puK, prK, function(err, out) {
            expect(err).to.be.a('object');
            expect(err.code).to.equal(-1);
            done();
        });
    });

    it('get', function(done){
        userModel.get(k, function(err,data){
            expect(err).to.equal(null);
            expect(data.uid).to.equal(k);
            done();
        })
    });
    it('remove', function(done) {
        userModel.remove(k, function(err, data) {
            expect(err).to.equal(null);
            expect(data).to.equal(1);
            done();
        });
    });
    after(function() {
        userModel.db.close();
    });
});

describe('PermissionModel', function() {
    it('alow', function(done) {
        permissionModel.add(k, 'test' + k, 'some1', function(err, out) {
            expect(err).to.equal(null);
            out = out[0];
            expect(out).to.be.a('object');
            expect(out.uid).to.equal(k);
            expect(out.uid2).to.equal('test' + k);
            expect(out.key).to.equal('some1');
            done();
        });
    });
    it('get', function(done) {
        permissionModel.get(k, 'test' + k, 'some1', function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.be.a('object');
            expect(out.uid).to.equal(k);
            expect(out.uid2).to.equal('test' + k);
            expect(out.key).to.equal('some1');
            done();
        });
    });
    it('listUsers', function(done) {
        permissionModel.listUsers(k, function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.be.a('array');
            expect(out[0]).to.equal('test' + k);
            done();
        });
    });
    it('listKeys', function(done) {
        permissionModel.listKeys(k, 'test' + k, function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.be.a('array');
            expect(out[0]).to.equal('some1');
            done();
        });
    });
    it('remove', function(done) {
        permissionModel.remove(k,'test'+k, 'some1', function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.equal(1);
            done();
        });
    });
    it('ensure removed', function(done){
        permissionModel.get(k,'test'+k,'some1', function(err,out){
            expect(err).to.equal(null);
            expect(out).to.equal(null);
            done();
        });
    });
    after(function() {
        permissionModel.db.close();
    })
});

describe('DataModel', function() {
    it('add', function(done) {
        dataModel.add(k, 'some1', {
            some: 'data'
        }, function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.be.a('array');
            out = out[0];
            expect(out.uid).to.equal(k);
            expect(out.key).to.equal('some1');
            expect(out.data).to.deep.equal({
                some: 'data'
            });
            done();
        });
    });
    it('get', function(done) {
        dataModel.get(k, 'some1', function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.be.a('object');
            expect(out).to.have.property('data');
            expect(out.data).to.deep.equal({
                some: 'data'
            });
            done();
        });
    });
    it('remove', function(done) {
        dataModel.remove(k, 'some1', function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.equal(1);
            done();
        });
    });
    it('ensure removed', function(done) {
        dataModel.get(k, 'some1', function(err, out) {
            expect(err).to.equal(null);
            expect(out).to.equal(null);
            done();
        });
    });
    after(function() {
        dataModel.db.close();
    });

});

