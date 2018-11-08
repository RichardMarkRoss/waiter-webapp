module.exports = function (pool) {
    async function getAllWeekDays (username) {
        const day = await pool.query('select id, week_day from weekdays');
        const holdDays = day.rows;
        let daysChosen = await pool.query(`select waiter_name, week_day from shifts 
         join waiters on waiters.id = shifts.waiter_id 
         join weekdays on weekdays.id = shifts.day_id
         where waiter_name = $1;`, [username]);
        console.log(daysChosen);
        return holdDays;
    }
    async function getAllWaiters (username) {
        let daysChosen = await pool.query(`select waiter_name, week_day from shifts 
         join waiters on waiters.id = shifts.waiter_id 
         join weekdays on weekdays.id = shifts.day_id
         where weekdays.week_day = $1;
         `, [username]);
        const waiterNameFilter = daysChosen.rows;

        return waiterNameFilter;
    }

    async function insertWaiter (username) {
        const addWaiterName = await pool.query('select id from waiters where waiter_name = $1', [username]);
        if (addWaiterName.rows.length === 0) {
            await pool.query('insert into waiters(waiter_name) values($1)', [username]);
        }
    }

    async function displayShifts () {
        let match = await getDay();

        for (let weeks of match) {
            let getWorkDays = await pool.query(`SELECT waiters.waiter_name as waiter
            from Shifts
            Inner Join waiters
            On shifts.waiter_id = waiters.id
            Inner JOIN weekdays
            on shifts.day_id = weekdays.id where weekdays.id = $1`, [weeks.id]);
            weeks.users = getWorkDays.rows;
            // console.log(weeks.users);
            if (weeks.users.length === 0) {
                weeks.marked = 'nothing';
            }

            if (weeks.users.length > 0 && weeks.users.length < 3) {
                weeks.checked = 'red';
            } else if (weeks.users.length === 3) {
                weeks.checked = 'orange';
            } else if (weeks.users.length > 3) {
                weeks.checked = 'green';
            }
        };
        console.log(match);
        return match;
    }

    async function matchCheckDays (username) {
        let checker = await getDay();
        let waiter = await getAllWaiters(username);

        for (let waiterNames of waiter) {
            for (let weekdays of checker) {
                if (waiterNames.week_days === weekdays.week_days) {
                    weekdays.checked = 'checked';
                } else if (weekdays.checked) {
                    weekdays.color = 'color';
                }
            }
        }
        return checker;
    }

    async function daysPassed (daysID, username) {
        let waiterData = await pool.query('select id from waiters where waiter_name = $1', [username]);
        let waiterID = waiterData.rows[0].id;
        await pool.query('delete from shifts where waiter_id = $1', [waiterID]);
        for (let days of daysID) {
            await pool.query('select id from weekdays where week_day = $1', [days]);

            await pool.query('insert into shifts(day_id, waiter_id) values($1, $2)', [days, waiterID]);
        }
    }

    async function getDay () {
        let result = await pool.query('select * from weekdays');
        return result.rows;
    }

    async function clearDayValues () {
        await pool.query('delete from shifts');
        await pool.query('ALTER SEQUENCE shifts_id_seq RESTART WITH 1;');
        await pool.query('delete from waiters');
        await pool.query('ALTER SEQUENCE waiters_id_seq RESTART WITH 1;');
    }

    return {
        getAllWeekDays,
        insertWaiter,
        clearDayValues,
        daysPassed,
        displayShifts,
        getDay,
        getAllWaiters,
        matchCheckDays
    };
};
