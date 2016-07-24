const fs = require('fs');
const path = require('path');
const assert = require('assert');

const helper = require('../helper');
const PouchDB = require('../../lib/pouch-graphql/pouchdb');
const graphql = require('graphql').graphql;
const graphqlPouchSchema = require('../../lib/pouch-graphql');

const ENVIRONMENT = 'test';
const TEST_FIXTURES = 'test/integration/fixtures';
const SCHEMA_DEFINITION = `
type Post {
  id: ID
  rev: String
  personId: ID
  title: String
  body: String
}

type Comment {
  id: ID
  rev: String
  personId: ID
  title: String
}

type Person {
  id: ID
  rev: String
  name: String
}

type Tag {
  id: ID
  value: String
}
`;

describe('Integration tests', function() {
  const db = PouchDB.createPouchDB(ENVIRONMENT);

  before(() => {
    const post1 = {
      doctype: 'Post',
      _id: 'test1',
      title: 'title 1',
      body: 'body 1',
    };
    const post2 = {
      doctype: 'Post',
      _id: 'test2',
      title: 'title 2',
      body: 'body 2',
    };
    const post3 = {
      doctype: 'Post',
      _id: 'test3',
      title: 'title 3',
      body: 'body 3',
    };

    return db.bulkDocs([
      post1,
      post2,
      post3,
    ]);
  });

  after(() => {
    return db.destroy();
  });

  fs.readdirSync(TEST_FIXTURES).forEach(fileName => {
    if (path.extname(fileName) === '.graphql') {
      const testName = path.basename(fileName, '.graphql');

      it(`GraphQL query ${testName}`, () => {
        const sut = graphqlPouchSchema(ENVIRONMENT, SCHEMA_DEFINITION, false, []);
        const expectedData = helper.json(`test/integration/fixtures/${testName}.json`);

        const operationName = null;
        const rootValue = null;
        const contextValue = {environment:ENVIRONMENT, user: {}};
        const schemaQuery = helper.read(`test/integration/fixtures/${testName}.graphql`);
        const variableValues = null;

        return sut.query(schemaQuery, variableValues, rootValue, contextValue, operationName)
          .then(result => {
            assert.deepEqual(result, expectedData)
          });
      });

    }
  });

});