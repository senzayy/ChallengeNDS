const pool = require('./connection');

const convertDate = x =>{
	const newArr = x.split("-").reverse();
    const new_date = `${newArr[1]}/${newArr[0]}/${newArr[2]}`;
    return new_date;
}

const simpleConvert = x =>{
    return x.split("-").reverse().join("-");
}

const validasiTanggal = x =>{
    const curr_date = new Date();
    const input_date = new Date(x);
    let diff = curr_date-input_date;
    return Math.floor(diff/(3600*24*1000));
}

const insertData = async (nama, tglMasuk, no_hp, limit_reim) =>{
    const f_tglMasuk = tglMasuk.split("-").reverse().join("-");

    return await pool.query('INSERT INTO karyawan(nama_karyawan,tanggal_masuk,no_hp,limit_reimburse) VALUES ($1,$2,$3,$4)',
    [nama, tglMasuk, no_hp, limit_reim]);
}


module.exports = 
{
    convertDate,
    validasiTanggal,
    insertData,
    simpleConvert
};