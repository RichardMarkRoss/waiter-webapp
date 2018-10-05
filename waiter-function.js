module.exports = function (pool) {
    async function getAllWeekDays (){
        const day = await pool.query('select week_day from weekdays');
        const holdDays = day.rows;
        return holdDays;
    }

    async function insertWaiter(username) {
        await pool.query('insert into waiters(waiter_name) values($1)',[username])
    }
    return {
        getAllWeekDays,
        insertWaiter
    }
};