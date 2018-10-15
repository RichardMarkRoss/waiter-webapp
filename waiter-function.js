module.exports = function (pool) {
    async function getAllWeekDays(username) {
        const day = await pool.query('select id, week_day from weekdays');
        const holdDays = day.rows;
        // get the days the user is working for...

        // mark each day the user is working in holdDays - checked = 'checked' if not checked = '';

        return holdDays;
    }

    async function insertWaiter(username) {
        const addWaiterName = await pool.query('select id from waiters where waiter_name = $1', [username]);
        // console.log(addWaiterName.rows[0].id);
        if (addWaiterName.rows.length === 0) {
            await pool.query('insert into waiters(waiter_name) values($1)', [username]);
        }
    }

    async function daysPassed(daysID, username) {
        // console.log(daysID);

        let waiterData = await pool.query('select id from waiters where waiter_name = $1', [username]);
        let waiterID = waiterData.rows[0].id;
        // console.log(waiterID);
        for (let days of daysID) {
            // console.log(days);
            await pool.query('select id from weekdays where week_day = $1', [days]);

            // console.log(dayData); let dayData =
            await pool.query('insert into shifts(day_id, waiter_id) values($1, $2)', [days, waiterID]);
        }
    }



    async function clearDayValues() {
        await pool.query('delete from shifts');
        await pool.query('ALTER SEQUENCE shifts_id_seq RESTART WITH 1;');
        await pool.query('delete from waiters');
        await pool.query('ALTER SEQUENCE waiters_id_seq RESTART WITH 1;');
    }

    return {
        getAllWeekDays,
        insertWaiter,
        clearDayValues,
        daysPassed
    };
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ later use ++++++++++++++++++++++++++++++++++++++++++++++++++++

// async function daysChecked(checked) {
//     const daysSelected = await pool.query('select week_day from weekday where week_day = $1', [checked]);
//     await pool.query('insert into shifts(day_id) values($1)', [daysSelected.rows[0].id]);
// };

// await pool.query(' SELECT waiter_name FROM waiters.columns WHERE waiter_name = $1 THEN ALTER TABLE waiters DROP IF EXISTS waiter_name', [username]);