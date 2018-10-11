module.exports = function (pool) {
    async function getAllWeekDays() {
        const day = await pool.query('select id, week_day from weekdays');
        const holdDays = day.rows;
        return holdDays;
    }
    async function daysPassed(daysID, username) {
        // console.log(daysID);

        let waiterData = await pool.query('select id from waiters where waiter_name = $1', [username]);
        let waiterID = waiterData.rows[0].id;
        console.log(waiterID);
        for (let days of daysID) {
            console.log(days);
            let dayData = await pool.query('select id from weekdays where week_day = $1', [days]);

            console.log(dayData);
            await pool.query('insert into shifts(day_id, waiter_id) values($1, $2)', [days, waiterID]);
        }
    }

    async function insertWaiter(username) {
        // await pool.query(' SELECT waiter_name FROM waiters.columns WHERE waiter_name = $1 THEN ALTER TABLE waiters DROP IF EXISTS waiter_name', [username]);
        await pool.query('insert into waiters(waiter_name) values($1)', [username]);
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

// async function daysChecked(checked) {
//     const daysSelected = await pool.query('select week_day from weekday where week_day = $1', [checked]);
//     await pool.query('insert into shifts(day_id) values($1)', [daysSelected.rows[0].id]);
// };