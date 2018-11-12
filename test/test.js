let assert = require('assert');
let factory = require('../waiter-function');
// let data = require('../greetingsDataFunction');
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
    beforeEach (async function () {
        await pool.query('delete from shifts');
        await pool.query('delete from waiters');
    });

    it('test should not display the same name twice', async function () {
        const findUserCountSQL = 'select count(*) from waiters where waiter_name = $1';
        let userCountResults = await pool.query(findUserCountSQL, ['andre']);

        assert.equal(0, userCountResults.rows[0].count);

        await theWaiterFac.insertWaiter('andre');
        await theWaiterFac.insertWaiter('andre');

        userCountResults = await pool.query(findUserCountSQL, ['andre']);
        assert.equal(1, userCountResults.rows[0].count);
    });

    it('test the counter if had to have one name inside of it', async function () {
        let days = await theWaiterFac.getAllWeekDays();
        assert.strictEqual(days.length, 7);
    });

    it('Should render a list of shifts with a day and a name', async function () {
        await theWaiterFac.insertWaiter('andre');

        await theWaiterFac.insertWaiter('greg');

        await theWaiterFac.daysPassed([1, 2, 5], 'andre');
        await theWaiterFac.daysPassed([2, 4, 6], 'greg');


        let days = await theWaiterFac.getAllWaiters();

        assert.strictEqual(days.length, 0);
    });

    after (function () {
        pool.end();
    });
});
