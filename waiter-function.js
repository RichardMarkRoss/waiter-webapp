module.exports = function (pool) {
    async function getAllWeekDays(username) {
        const day = await pool.query('select id, week_day from weekdays');
        const holdDays = day.rows;

        let daysChosen = await pool.query(`select waiter_name, week_day, checked from shifts 
         join waiters on waiters.id = shifts.waiter_id 
         join weekdays on weekdays.id = shifts.day_id
         where waiter_name = $1;`, [username]);
        // console.log(daysChosen);
        return holdDays;
    }
    async function getAllWaiters(username) {
        let daysChosen = await pool.query(`select waiter_name, week_day, checked from shifts 
         join waiters on waiters.id = shifts.waiter_id 
         join weekdays on weekdays.id = shifts.day_id
         where weekdays.week_day = $1;
         `, [username]);
        const waiterNameFilter = daysChosen.rows;
        return waiterNameFilter;
    }

    async function getAllShifts() {
        let weekDays = await getAllWeekDays();
        let allShifts = await pool.query(`
        select waiter_name from shifts
        join waiters on waiters.id = shifts.waiter_id
        join weekdays on weekdays.id = shifts.day_id
        `);
        const shifts = allShifts.rows;

        // console.log(shifts);
        let shiftList = [];

        // loop through all the days
        for (let i = 0; weekDays.length; i++) {
            let day = weekDays[i];
            // console.log(day);
            let currentDay = {
                week_day: day.week_day,
                shift: []
            };
            console.log(currentDay.week_day);
            // console.log(currentDay);
            // find all the waiters working on this day
            let waiterNames = await getAllWaiters(day.week_day);
            // for (let i = 0; waiterNames.length; i++) {
            currentDay.shift = waiterNames;
            //     let shiftIndex = shifts[i];
            //     console.log(shiftIndex);
            //     shiftList.shift.push(shiftIndex.waiter_name);
            // }
            // console.log(waiterNames);
            shiftList = currentDay;
        }
        console.log(shiftList)
        return shiftList;
        // for (let days of weekDays) {
        //     // shiftList.push({
        //     //     week_day: days.week_day,
        //     //     shift: []
        //     // });
        //     for (let shift of shifts) {
        //         if (days.week_day === shift.week_day) {
        //             shiftList.push({
        //                 week_day: days.week_day,
        //                 shift: [shift.waiter_name]
        //             });
        //         }
        //     }
        // }
        // console.log(shiftList);
        // return shiftList;
    }

    async function insertWaiter(username) {
        const addWaiterName = await pool.query('select id from waiters where waiter_name = $1', [username]);
        if (addWaiterName.rows.length === 0) {
            await pool.query('insert into waiters(waiter_name) values($1)', [username]);
        }
    }

    async function daysPassed(daysID, username) {
        let waiterData = await pool.query('select id from waiters where waiter_name = $1', [username]);
        let waiterID = waiterData.rows[0].id;
        await pool.query('delete from shifts where waiter_id = $1', [waiterID]);
        for (let days of daysID) {
            await pool.query('select id from weekdays where week_day = $1', [days]);
            let marked = 'checked';

            await pool.query('insert into shifts(day_id, waiter_id, checked) values($1, $2, $3)', [days, waiterID, marked]);
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
        daysPassed,
        getAllShifts
    };
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ notes ++++++++++++++++++++++++++++++++++++++++++++++++++++

// async function daysChecked(checked) {
//     const daysSelected = await pool.query('select week_day from weekday where week_day = $1', [checked]);
//     await pool.query('insert into shifts(day_id) values($1)', [daysSelected.rows[0].id]);
// };

// await pool.query(' SELECT waiter_name FROM waiters.columns WHERE waiter_name = $1 THEN ALTER TABLE waiters DROP IF EXISTS waiter_name', [username]);

// join statement example (not working just needed for understanding structure).
// ('select towns_names, plates from towns join number_plates on towns.id = number_plates.towns_id where towns_names = $1 ', [plate]);