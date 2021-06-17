const toogle = document.getElementById('pilih');
const label_nama = document.getElementById('label_nama');
const label_tglawal = document.getElementById('label_tglawal');
const label_tglakhir = document.getElementById('label_tglakhir');
const label_no = document.getElementById('label_no');

const nama = document.getElementById('nama');
const tgl_awal = document.getElementById('tgl_awal');
const tgl_akhir = document.getElementById('tgl_akhir');
const no = document.getElementById('no');

toogle.addEventListener('click', ()=>{
    if(toogle.value == 1){
        label_nama.classList.replace('hilang', 'muncul');
        nama.classList.replace('hilang', 'muncul');
        nama.required = true;
        no.value = "";
        tgl_awal.value = "";
        tgl_akhir.value = "";
       
        label_tglawal.classList.replace('muncul', 'hilang');
        label_tglakhir.classList.replace('muncul', 'hilang');
        label_no.classList.replace('muncul', 'hilang');
        tgl_awal.classList.replace('muncul', 'hilang');
        tgl_akhir.classList.replace('muncul', 'hilang');
        no.classList.replace('muncul', 'hilang');
        tgl_awal.required = false;
        tgl_akhir.required = false;
        no.required = false;
    }
    if(toogle.value == 2){
        label_tglawal.classList.replace('hilang', 'muncul');
        label_tglakhir.classList.replace('hilang', 'muncul');
        tgl_awal.classList.replace('hilang', 'muncul');
        tgl_akhir.classList.replace('hilang', 'muncul');
        tgl_awal.required = true;
        tgl_akhir.required = true;
        nama.value = "";
        no.value = "";

        label_nama.classList.replace('muncul', 'hilang');
        label_no.classList.replace('muncul', 'hilang');
        nama.classList.replace('muncul', 'hilang');
        no.classList.replace('muncul', 'hilang');
        nama.required = false;
        no.required = false;
    }
    if(toogle.value == 3){
        label_no.classList.replace('hilang', 'muncul');
        no.classList.replace('hilang', 'muncul');
        no.required = true;
        nama.value = "";
        tgl_awal.value = "";
        tgl_akhir.value = "";
       
        label_tglawal.classList.replace('muncul', 'hilang');
        label_tglakhir.classList.replace('muncul', 'hilang');
        label_nama.classList.replace('muncul', 'hilang');
        tgl_awal.classList.replace('muncul', 'hilang');
        tgl_akhir.classList.replace('muncul', 'hilang');
        nama.classList.replace('muncul', 'hilang');
        tgl_awal.required = false;
        tgl_akhir.required = false;
        nama.required = false;
    }

});
