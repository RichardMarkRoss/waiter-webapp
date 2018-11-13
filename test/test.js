let assert = require('assert');
let factory = require('../waiter-function');
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

describe('the waiter function basic test', function () {
    beforeEach(async function () {
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

    it('test the list if had to have one name inside of it', async function () {
        let days = await theWaiterFac.getAllWeekDays();
        assert.strictEqual(days.length, 7);
    });

    it('Should render a list of shifts with a day and a name', async function () {
        await theWaiterFac.insertWaiter('andre');

        await theWaiterFac.daysPassed([1, 2, 5], 'andre');

        let days = await theWaiterFac.getAllWaiters();

        assert.strictEqual(days.length, 0);
    });
    it('should display all the shift that render on the home page', async function () {
        let waiter = await theWaiterFac.matchCheckDays('andre');
        assert.deepEqual(waiter,

            [{ id: 1, week_day: 'Monday' },
                { id: 2, week_day: 'Tuesday' },
                { id: 3, week_day: 'Wednesday' },
                { id: 4, week_day: 'Thursday' },
                { id: 5, week_day: 'Friday' },
                { id: 6, week_day: 'Saturday' },
                { id: 7, week_day: 'Sunday' }
            ]
        );
    });

    after(function () {
        pool.end();
    });
});
