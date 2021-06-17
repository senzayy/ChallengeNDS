const express = require('express');
const app = express();
const pool = require('./connection');
const func = require('./func');

app.use(express.urlencoded({extended: false})); //utk parse JSON data dari inputan user / get req body
app.use(express.static('public'));

pool.connect((err) =>{
  if(err) throw error;
  console.log("Database Connected!");
});

app.get('/',  async (req,res) => {
    res.render('index.ejs');
});

app.get('/menu_cariuser', async (req,res)=>{
  const getAllUsers = await pool.query('SELECT * FROM karyawan');
  res.render('menu_cari.ejs', {hasil_auto:getAllUsers.rows,
    hasil_manual:null, isSearch:false, category:null, nilai:null 
  });
});

app.post('/search_user', async(req,res)=>{
  const nama = req.body.nama_karyawan;
  const tgl_awal = req.body.tgl_awal;
  const tgl_akhir = req.body.tgl_akhir;
  const no_hp = req.body.no_hp;

  if(nama!==""){
  const f_nama = `%${nama}%`
  const cari_user = await pool.query('SELECT * FROM karyawan where nama_karyawan like $1', [f_nama]);
  res.render('menu_cari.ejs', {hasil_auto:null, hasil_manual:cari_user.rows,isSearch:true, category:'Nama Karyawan', nilai:nama});
  }

  else if(no_hp !== ""){
    const f_no_hp = `%${no_hp}%`
    const cari_user = await pool.query('SELECT * FROM karyawan where no_hp like $1', [f_no_hp]);
    res.render('menu_cari.ejs', {hasil_auto:null, hasil_manual:cari_user.rows,isSearch:true, category:'Nomor HP', nilai:no_hp});
  }

  else{
  const cari_user = await pool.query('SELECT * FROM karyawan where tanggal_masuk between $1 and $2', [tgl_awal, tgl_akhir]);
  res.render('menu_cari.ejs', {hasil_auto:null, hasil_manual:cari_user.rows,isSearch:true, category:'Tanggal', 
  nilai:`Tanggal ${tgl_awal} s/d ${tgl_akhir}`});
  }

});

app.get('/menu_tambahuser', async (req,res) =>{
  res.render('add_user.ejs', {error:false, message:null});
});

app.post('/tambah_user', async (req,res) => {
  try{
    const name = req.body.nama_karyawan;
    const cek =  await pool.query('SELECT nama_karyawan from karyawan');
    let err = false;

    if(cek.rowCount > 0){
      for(let y=0;y<cek.rows.length;y++){
        if(cek.rows[y].nama_karyawan.toLowerCase() === name.toLowerCase()){
          err = true;
        }
      }
    }

    if(err){
      res.render('add_user.ejs',{error:true, message:"Terdapat nama karyawan yang sama!"});
    }
    else{
    const tglMasuk = req.body.tanggal_masuk;
    const nama_karyawan = req.body.nama_karyawan;
    const no_hp = req.body.no_hp;
    const limit_reim = req.body.limit_reim;
    const new_tglMasuk = func.convertDate(tglMasuk);
    const validasiTgl = func.validasiTanggal(new_tglMasuk);

      if(validasiTgl < -90){
        res.render('add_user.ejs', {error:true, message:"Tanggal Masuk Kerja 3 Bulan lebih besar dari tanggal saat ini"});
      }
      else if(validasiTgl > 60){
        res.render('add_user.ejs',{error:true, message:"Tanggal Masuk Kerja 2 Bulan lebih kecil dari tanggal saat ini"});
      }
      else{
      func.insertData(nama_karyawan,tglMasuk, no_hp, limit_reim);

      setTimeout(()=>{
        res.redirect('/')
      }, 500);
      }
    }//penutup else atas if row count
  }//penutup try
  catch(err){
    console.error(err.message);
  }
});

app.post('/delete_user/:kode_karyawan', async(req, res) =>{
  try{
    await pool.query('DELETE FROM karyawan where kode_karyawan = $1', [req.params.kode_karyawan]);
    res.redirect('/menu_cariuser');
  }
  catch(err){
    console.error(err.message);
  }
});

app.get('/edit_user/:kode_karyawan', async(req,res)=>{
    const getUser = await pool.query('SELECT * FROM karyawan where kode_karyawan = $1',
    [req.params.kode_karyawan]);
    res.render('edit_user.ejs', {hasil: getUser.rows[0], error:false, message:null});
});

app.post('/update_user/:kode_karyawan', async(req,res)=>{
  try{
    const name = req.body.nama_karyawan;
    const kode = req.params.kode_karyawan;
    const cek =  await pool.query('SELECT nama_karyawan FROM karyawan where NOT kode_karyawan = $1', [kode]);
    let err = false;

    if(cek.rowCount > 0){
      for(let y=0;y<cek.rows.length;y++){
        if(cek.rows[y].nama_karyawan.toLowerCase() === name.toLowerCase()){
          err = true;
        }
      }
    }

    if(err){
      const getUser = await pool.query('SELECT * FROM karyawan where kode_karyawan = $1',
      [req.params.kode_karyawan]);
      res.render('edit_user.ejs', {hasil : getUser.rows[0], error:true, message:"Terdapat nama karyawan yang sama!"});
    }
    else{
    const tglMasuk = req.body.tgl_masuk;
    const nama_karyawan = req.body.nama_karyawan;
    const no_hp = req.body.no_hp;
    const limit_reim = req.body.limit_reim;
    const c_tglMasuk = func.simpleConvert(tglMasuk);
    const new_tglMasuk = func.convertDate(c_tglMasuk);
    const validasiTgl = func.validasiTanggal(new_tglMasuk);

      if(validasiTgl < -90){
        const getUser = await pool.query('SELECT * FROM karyawan where kode_karyawan = $1',
        [req.params.kode_karyawan]);
        res.render('edit_user.ejs', {hasil: getUser.rows[0],error:true,message:"Tanggal Masuk Kerja 3 Bulan lebih besar dari tanggal saat ini"});
        }
      else if(validasiTgl > 60){
        const getUser = await pool.query('SELECT * FROM karyawan where kode_karyawan = $1',
        [req.params.kode_karyawan]);
        res.render('edit_user.ejs', {hasil: getUser.rows[0],error:true, message:"Tanggal Masuk Kerja 2 Bulan lebih kecil dari tanggal saat ini"});
      }
      else{
        const x = new Date();
        const hari = x.getDate();
        const bulan = x.getMonth();
        const tahun = x.getFullYear();
        const new_date = `${hari}-0${bulan+1}-${tahun}`;
        await pool.query('UPDATE karyawan SET nama_karyawan = $1,tanggal_masuk = $2,no_hp = $3,limit_reimburse = $4,updated_date = $5 WHERE kode_karyawan = $6',
        [nama_karyawan, tglMasuk, no_hp, limit_reim, new_date,kode]);
        setTimeout(()=>{
          res.redirect('/menu_cariuser')
        }, 500);
      }
    }//penutup else atas if row count
  }//penutup try
  catch(err){
    console.error(err.message);
    const getUser = await pool.query('SELECT * FROM karyawan where kode_karyawan = $1',
    [req.params.kode_karyawan]);
    res.render('edit_user.ejs', {hasil : getUser.rows[0]});
  }
});

app.listen(3000);