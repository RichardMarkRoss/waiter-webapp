module.exports = function (pool) {
    async function getAllWeekDays () {
        const day = await pool.query('select id, week_day from weekdays');
        const holdDays = day.rows;
        return holdDays;
    }
    async function daysPassed (daysID, username) {
        for (let days of daysID) {
            let dayData = await pool.query('select * from weekdays where week_day = $1', [days]);
            dayData = dayData.rows[0];
            console.log(dayData);
            await pool.query('insert into shifts(day_id, waiter_id) values($1, $2) ', [dayData, username]);
        }
    }
    async function insertWaiter (username) {
        await pool.query('insert into waiters(waiter_name) values($1)', [username]);
    }
    async function clearDayValues () {
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
// }
