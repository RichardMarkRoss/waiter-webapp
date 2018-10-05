let assert = require('assert');
let factory = require('../waiter-function');
//let data = require('../greetingsDataFunction');
const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_app';

const pool = new Pool({
    connectionString,
    ssl: useSSL
});
// const theGreetingsData = data(pool);
const theWaiterFac = factory(pool);

describe('the greetings function basic test', function () {

    beforeEach(async function () {
       // await pool.query('delete from hold_name');
    });
 it('test the counter if had to have one name inside of it', async function () {
    let days = await theWaiterFac.getAllWeekDays();
     assert.strictEqual(days.length, 7);
 });

        after(function () {
        pool.end();
    });
});