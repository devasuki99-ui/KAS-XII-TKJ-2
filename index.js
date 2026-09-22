const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

// ========================================
// KONFIGURASI BOT
// ========================================

const PREFIX = '!';

// Karena Minggu 1 MBG dimulai pada Selasa,
// gunakan tanggal Selasa awal Minggu 1.
//
// SAAT INI DIATUR:
// Selasa, 1 September 2026 = Minggu 1
//
// Jika ternyata tanggal awalnya berbeda,
// ubah bagian ini.

const MBG_START_DATE = new Date(2026, 8, 1);

// ========================================
// CLIENT WHATSAPP
// ========================================

const client = new Client({
    authStrategy: new LocalAuth()
});

// ========================================
// FOLDER DATA
// ========================================

const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const PENGUMUMAN_FILE =
    path.join(DATA_DIR, 'pengumuman.json');

// ========================================
// DATABASE PENGUMUMAN
// ========================================

function loadPengumuman() {

    if (!fs.existsSync(PENGUMUMAN_FILE)) {

        const dataAwal = {
            text: '',
            updatedAt: ''
        };

        fs.writeFileSync(
            PENGUMUMAN_FILE,
            JSON.stringify(dataAwal, null, 2)
        );

        return dataAwal;
    }

    try {

        return JSON.parse(
            fs.readFileSync(
                PENGUMUMAN_FILE,
                'utf8'
            )
        );

    } catch (error) {

        return {
            text: '',
            updatedAt: ''
        };

    }
}

function savePengumuman(data) {

    fs.writeFileSync(
        PENGUMUMAN_FILE,
        JSON.stringify(data, null, 2)
    );
}

let pengumuman = loadPengumuman();

// ========================================
// NAMA HARI
// ========================================

const hariIndonesia = [
    'minggu',
    'senin',
    'selasa',
    'rabu',
    'kamis',
    'jumat',
    'sabtu'
];

const namaHari = {
    minggu: 'Minggu',
    senin: 'Senin',
    selasa: 'Selasa',
    rabu: 'Rabu',
    kamis: 'Kamis',
    jumat: 'Jumat',
    sabtu: 'Sabtu'
};

// ========================================
// JADWAL PELAJARAN XII TKJ 2
// ========================================

const jadwal = {

    senin: [
        'Konsentrasi Keahlian TKJ',
        'Konsentrasi Keahlian TKJ',
        'Pendidikan Pancasila',
        'Bahasa Inggris',
        'Seni'
    ],

    selasa: [
        'Konsentrasi Keahlian TKJ',
        'Konsentrasi Keahlian TKJ',
        'Konsentrasi Keahlian TKJ',
        'Kreativitas, Inovasi & Kewirausahaan',
        'Kreativitas, Inovasi & Kewirausahaan'
    ],

    rabu: [
        'Seni',
        'Matematika',
        'Konsentrasi Keahlian TKJ',
        'Konsentrasi Keahlian TKJ',
        'Konsentrasi Keahlian TKJ'
    ],

    kamis: [
        'Konsentrasi Keahlian TKJ',
        'Konsentrasi Keahlian TKJ',
        'Konsentrasi Keahlian TKJ',
        'Bimbingan dan Konseling',
        'Pendidikan Agama dan Budi Pekerti',
        'Pendidikan Agama dan Budi Pekerti'
    ],

    jumat: [
        'Bahasa Inggris',
        'Seni',
        'Matematika',
        'Bahasa Indonesia',
        'Bahasa Indonesia'
    ]
};

// ========================================
// JADWAL MBG
//
// Setiap minggu memiliki:
// pengambilan
// pengembalian
// ========================================

const mbg = {

    minggu1: {

        senin: {
            pengambilan: [
                'Addeva Narrendra W',
                'Faizal Yusuf S',
                'Bima Putra Pamungkas',
                'Faiszal A.A.S'
            ],

            pengembalian: [
                'Binti Hidayatun N',
                'Defi Dwi Astuti',
                'Afisa Dwi Lestari',
                'Neza Nurul H'
            ]
        },

        selasa: {
            pengambilan: [
                'Muhammad Bayu F',
                'Tegar Setya A',
                'Binar Putra Pratama',
                'Yudha Muhammad S'
            ],

            pengembalian: [
                'Maylav Fisa A.P.',
                'Yulia Tri Hapsari',
                'Alexa Salsabila R',
                'Intan Nafiza'
            ]
        },

        rabu: {
            pengambilan: [
                'Fahdo Arjuna',
                'Faizal Yusuf Santosa',
                'Rizal Handi F',
                'Gilang Dwi R'
            ],

            pengembalian: [
                'Mutia Ayu P',
                'Arvina Ganes T',
                'Rizki Salsabila S',
                'Novia Rahma D'
            ]
        },

        kamis: {
            pengambilan: [
                'Faiszal A.A.S',
                'Galih Oktavian',
                'Reyhan Dwika P',
                'Fahdo Arjuna'
            ],

            pengembalian: [
                'Sherina Artha N.C.R',
                'Aurel Fetterra F',
                'Diah Puspita',
                'Maylav Fisa A.P'
            ]
        },

        jumat: {
            pengambilan: [
                'Muhammad Ikhsan M',
                'Gilang Dwi R',
                'Bima Putra P',
                'Neo Restu Y'
            ],

            pengembalian: [
                'Sherina Artha N.C.R',
                'Defi Dwi Astuti',
                'Afisa Dwi L',
                'Aurel Fetterra F'
            ]
        }
    },

    minggu2: {

        senin: {
            pengambilan: [
                'Tegar Setya A',
                'Gustap Saputro',
                'Faiszal A.A.S',
                'Fahdo Arjuna'
            ],

            pengembalian: [
                'Mutia Ayu P',
                'Diah Puspita',
                'Rizki Salsabila S',
                'Binti Hidayatun N'
            ]
        },

        selasa: {
            pengambilan: [
                'Muhammad Bayu F',
                'Muhammad Ikhsan M',
                'Yudha Muhammad S',
                'Galih Oktavian'
            ],

            pengembalian: [
                'Defi Dwi Astuti',
                'Intan Nafiza',
                'Neza Nurul H',
                'Maylav Fisa A.P'
            ]
        },

        rabu: {
            pengambilan: [
                'Gilang Dwi R',
                'Neo Restu Y',
                'Rulisetya F',
                'Gustap Saputro'
            ],

            pengembalian: [
                'Neza Nurul H',
                'Rizki Salsabila S',
                'Intan Nafiza',
                'Alexa Salsabila R'
            ]
        },

        kamis: {
            pengambilan: [
                'Reyhan Dwika P',
                'Rizal Handi F',
                'Bima Putra P',
                'Neo Restu Y'
            ],

            pengembalian: [
                'Diah Puspita',
                'Yulia Tri Hapsari',
                'Arvina Ganes T',
                'Aurel Fetterra F'
            ]
        },

        jumat: {
            pengambilan: [
                'Muhammad Ikhsan M',
                'Addeva Narrendra W',
                'Binar Putra P',
                'Rizal Handi F'
            ],

            pengembalian: [
                'Afisa Dwi L',
                'Arvina Ganes T',
                'Novia Rahma D',
                'Mutia Ayu P'
            ]
        }
    },

    minggu3: {

        senin: {
            pengambilan: [
                'Galih Oktavian',
                'Rulisetya F',
                'Bima Putra P',
                'Rizal Handi F'
            ],

            pengembalian: [
                'Afisa Dwi L',
                'Aurel Fetterra F',
                'Binti Hidayatun N',
                'Diah Puspita'
            ]
        },

        selasa: {
            pengambilan: [
                'Binar Putra P',
                'Faiszal A.A.S',
                'Binar Putra P',
                'Gustap Saputro'
            ],

            pengembalian: [
                'Mutia Ayu P',
                'Rizki Salsabila S',
                'Alexa Salsabila R',
                'Maylav Fisa A.P'
            ]
        },

        rabu: {
            pengambilan: [
                'Addeva Narrendra W',
                'Faizal Yusuf S',
                'Galih Oktavian',
                'Fahdo Arjuna'
            ],

            pengembalian: [
                'Binti Hidayatun N',
                'Diah Puspita',
                'Defi Dwi Astuti',
                'Neza Nurul H'
            ]
        },

        kamis: {
            pengambilan: [
                'Muhammad Bayu F',
                'Gilang Dwi R',
                'Yudha Muhammad S',
                'Reyhan Dwika P'
            ],

            pengembalian: [
                'Sherina Artha N.C.R',
                'Mutia Ayu P',
                'Intan Nafiza',
                'Novia Rahma D'
            ]
        },

        jumat: {
            pengambilan: [
                'Gustap Saputro',
                'Muhammad Bayu F',
                'Faizal Yusuf S',
                'Tegar Setya A'
            ],

            pengembalian: [
                'Yulia Tri Hapsari',
                'Neza Nurul H',
                'Sherina Artha N.C.R',
                'Alexa Salsabila R'
            ]
        }
    },

    minggu4: {

        senin: {
            pengambilan: [
                'Faizal Yusuf S',
                'Muhammad Ikhsan M',
                'Tegar Setya A',
                'Addeva Narrendra W'
            ],

            pengembalian: [
                'Binti Hidayatun N',
                'Diah Puspita',
                'Yulia Tri Hapsari',
                'Rizki Salsabila S'
            ]
        },

        selasa: {
            pengambilan: [
                'Muhammad Bayu F',
                'Neo Restu Y',
                'Muhammad Ikhsan M',
                'Yudha Muhammad S'
            ],

            pengembalian: [
                'Maylav Fisa A.P',
                'Novia Rahma D',
                'Intan Nafiza',
                'Arvina Ganes T'
            ]
        },

        rabu: {
            pengambilan: [
                'Gilang Dwi R',
                'Reyhan Dwika P',
                'Rulisetya F',
                'Gustap Saputro'
            ],

            pengembalian: [
                'Defi Dwi Astuti',
                'Rizki Salsabila S',
                'Neza Nurul H',
                'Novia Rahma D'
            ]
        },

        kamis: {
            pengambilan: [
                'Bima Putra P',
                'Rulisetya F',
                'Neo Restu Y',
                'Rizal Handi F'
            ],

            pengembalian: [
                'Afisa Dwi L',
                'Mutia Ayu P',
                'Arvina Ganes T',
                'Alexa Salsabila R'
            ]
        },

        jumat: {
            pengambilan: [
                'Binar Putra P',
                'Yudha Muhammad S',
                'Reyhan Dwika P',
                'Faiszal A.A.S'
            ],

            pengembalian: [
                'Aurel Fetterra F',
                'Maylav Fisa A.P',
                'Yulia Tri Hapsari',
                'Sherina Artha N.C.R'
            ]
        }
    }
};

// ========================================
// QR CODE
// ========================================

client.on('qr', qr => {

    console.log('\nSCAN QR CODE:\n');

    qrcode.generate(qr, {
        small: true
    });

});

// ========================================
// BOT SIAP
// ========================================

client.on('ready', () => {

    console.log('\n==============================');
    console.log('🤖 DEVA BOT ONLINE!');
    console.log('==============================\n');

});

// ========================================
// CEK ADMIN
// ========================================

async function isAdmin(message) {

    if (!message.from.endsWith('@g.us')) {
        return false;
    }

    const chat =
        await message.getChat();

    const senderId =
        message.author;

    const participant =
        chat.participants.find(
            participant =>
                participant.id._serialized === senderId
        );

    if (!participant) {
        return false;
    }

    return (
        participant.isAdmin ||
        participant.isSuperAdmin
    );
}

// ========================================
// FORMAT JADWAL
// ========================================

function formatJadwal(hari) {

    if (
        hari === 'sabtu' ||
        hari === 'minggu'
    ) {

        return `📚 *JADWAL PELAJARAN*

🎉 Hari ini libur!`;

    }

    const pelajaran = jadwal[hari];

    if (!pelajaran) {

        return `❌ Jadwal tidak ditemukan.`;

    }

    let hasil =
        `📚 *JADWAL ${namaHari[hari].toUpperCase()}*\n\n`;

    pelajaran.forEach(
        (mapel, index) => {

            hasil +=
                `${index + 1}. ${mapel}\n`;

        }
    );

    return hasil;
}

// ========================================
// MENGHITUNG MINGGU ROTASI MBG
// ========================================

function getMingguMBG(date) {

    const target = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const start = new Date(
        MBG_START_DATE.getFullYear(),
        MBG_START_DATE.getMonth(),
        MBG_START_DATE.getDate()
    );

    // Cari hari Senin dari minggu
    // tempat tanggal awal berada.

    const day = start.getDay();

    const daysFromMonday =
        day === 0 ? 6 : day - 1;

    start.setDate(
        start.getDate() - daysFromMonday
    );

    const difference =
        target - start;

    const days =
        Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

    const week =
        Math.floor(days / 7);

    // Rotasi 4 minggu
    const rotation =
        ((week % 4) + 4) % 4;

    return rotation + 1;
}

// ========================================
// FORMAT MBG
// ========================================

function formatMBG(hari, date) {

    if (
        hari === 'sabtu' ||
        hari === 'minggu'
    ) {

        return `🍱 *JADWAL MBG*

🎉 Hari ini libur.

Tidak ada jadwal pengambilan
atau pengembalian MBG.`;

    }

    const nomorMinggu =
        getMingguMBG(date);

    const mingguKey =
        `minggu${nomorMinggu}`;

    const dataHari =
        mbg[mingguKey][hari];

    if (!dataHari) {

        return `🍱 *JADWAL MBG*

Tidak ada data untuk hari ini.`;

    }

    let hasil =
`🍱 *JADWAL MBG*

📅 ${namaHari[hari]}
🔄 Minggu ${nomorMinggu}

📥 *PENGAMBILAN*
`;

    dataHari.pengambilan.forEach(
        (nama, index) => {

            hasil +=
                `${index + 1}. ${nama}\n`;

        }
    );

    hasil += `\n📤 *PENGEMBALIAN*\n`;

    dataHari.pengembalian.forEach(
        (nama, index) => {

            hasil +=
                `${index + 1}. ${nama}\n`;

        }
    );

    hasil +=
`\n🕐 Pengambilan dilakukan pada jam ke-6.
🕐 Pengembalian maksimal pukul 13.00 WIB.`;

    return hasil;
}

// ========================================
// TANGGAL BESOK
// ========================================

function getBesok() {

    const besok = new Date();

    besok.setDate(
        besok.getDate() + 1
    );

    return besok;
}

// ========================================
// EVENT PESAN
// ========================================

client.on(
    'message',
    async message => {

        try {

            const text =
                message.body.trim();

            if (!text.startsWith(PREFIX)) {
                return;
            }

            const commandLine =
                text.slice(PREFIX.length).trim();

            const parts =
                commandLine.split(/\s+/);

            const command =
                parts
                    .shift()
                    .toLowerCase();

            const args = parts;

            console.log(
                `Command: ${command}`
            );

            // ====================================
            // MENU
            // ====================================

            if (command === 'menu') {

                await message.reply(
`🤖 *DEVA BOT XII TKJ 2*

📚 *JADWAL*
!jadwal
!jadwal [hari]

🍱 *MBG*
!mbg

📅 *BESOK*
!besok

📢 *PENGUMUMAN*
!pengumuman

🖼️ *STIKER TEKS*
!stiker [teks kamu]

⚙️ *ADMIN*
!setinfo [pengumuman]
!clearinfo`
                );

                return;
            }

            // ====================================
            // JADWAL
            // ====================================

            if (command === 'jadwal') {

                let hari;

                if (args.length > 0) {

                    hari =
                        args[0].toLowerCase();

                } else {

                    hari =
                        hariIndonesia[
                            new Date().getDay()
                        ];
                }

                if (!namaHari[hari]) {

                    await message.reply(
`❌ Hari tidak ditemukan.

Contoh:
!jadwal senin`
                    );

                    return;
                }

                await message.reply(
                    formatJadwal(hari)
                );

                return;
            }

            // ====================================
            // MBG
            // ====================================

            if (command === 'mbg') {

                const sekarang =
                    new Date();

                const hari =
                    hariIndonesia[
                        sekarang.getDay()
                    ];

                await message.reply(
                    formatMBG(
                        hari,
                        sekarang
                    )
                );

                return;
            }

            // ====================================
            // PENGUMUMAN
            // ====================================

            if (command === 'pengumuman') {

                if (!pengumuman.text) {

                    await message.reply(
`📢 *PENGUMUMAN*

✅ Tidak ada pengumuman saat ini.`
                    );

                    return;
                }

                await message.reply(
`📢 *PENGUMUMAN*

${pengumuman.text}

🕐 Diperbarui:
${pengumuman.updatedAt}`
                );

                return;
            }

            // ====================================
            // SET INFO
            // ====================================

            if (command === 'setinfo') {

                const admin =
                    await isAdmin(message);

                if (!admin) {

                    await message.reply(
`⛔ Command ini hanya dapat
digunakan oleh admin grup.`
                    );

                    return;
                }

                const info =
                    args.join(' ').trim();

                if (!info) {

                    await message.reply(
`❌ Contoh:

!setinfo Besok membawa laptop.`
                    );

                    return;
                }

                pengumuman = {

                    text: info,

                    updatedAt:
                        new Date().toLocaleString(
                            'id-ID',
                            {
                                timeZone:
                                    'Asia/Jakarta'
                            }
                        )
                };

                savePengumuman(
                    pengumuman
                );

                await message.reply(
`📢 *PENGUMUMAN BARU*

${info}`
                );

                return;
            }

            // ====================================
            // HAPUS PENGUMUMAN
            // ====================================

            if (command === 'clearinfo') {

                const admin =
                    await isAdmin(message);

                if (!admin) {

                    await message.reply(
`⛔ Hanya admin grup yang
dapat menghapus pengumuman.`
                    );

                    return;
                }

                pengumuman = {

                    text: '',
                    updatedAt: ''
                };

                savePengumuman(
                    pengumuman
                );

                await message.reply(
`🗑️ Pengumuman telah dihapus.`
                );

                return;
            }

            // ====================================
            // BESOK
            // ====================================

            if (command === 'besok') {

                const besok =
                    getBesok();

                const hari =
                    hariIndonesia[
                        besok.getDay()
                    ];

                const jadwalBesok =
                    formatJadwal(hari);

                const mbgBesok =
                    formatMBG(
                        hari,
                        besok
                    );

                const info =
                    pengumuman.text ||
                    '✅ Tidak ada pengumuman saat ini.';

                await message.reply(
`📅 *INFORMASI BESOK*

${jadwalBesok}

━━━━━━━━━━━━━━

${mbgBesok}

━━━━━━━━━━━━━━

📢 *PENGUMUMAN*

${info}`
                );

                return;
            }

            // ====================================
            // STIKER TEKS
            // ====================================

            if (
                command === 'stiker' ||
                command === 'sticker'
            ) {

                const stickerText =
                    args.join(' ').trim();

                if (!stickerText) {

                    await message.reply(
`🖼️ *CARA MEMBUAT STIKER TEKS*

Contoh:

!stiker satu titik, dua koma,
aku cantik dan sigma.`
                    );

                    return;
                }

                // Batasi agar teks tidak terlalu panjang
                if (stickerText.length > 200) {

                    await message.reply(
`❌ Teks terlalu panjang.

Maksimal 200 karakter.`
                    );

                    return;
                }

                await message.reply(
                    '⏳ Sedang membuat stiker teks...'
                );

                // Kirim ke fungsi pembuat stiker teks
                const { createCanvas } = require('canvas');

                const canvas =
                    createCanvas(512, 512);

                const ctx =
                    canvas.getContext('2d');

                // Background transparan
                ctx.clearRect(
                    0,
                    0,
                    512,
                    512
                );

                // Background putih
                ctx.fillStyle = 'white';

                ctx.fillRect(
                    0,
                    0,
                    512,
                    512
                );

                // Teks hitam
                ctx.fillStyle = 'black';

                ctx.font =
                    'bold 52px Arial';

                ctx.textAlign =
                    'center';

                ctx.textBaseline =
                    'middle';

                // Memecah teks menjadi beberapa baris
                const words =
                    stickerText.split(' ');

                let lines = [];
                let currentLine = '';

                for (
                    const word of words
                ) {

                    const testLine =
                        currentLine
                            ? currentLine + ' ' + word
                            : word;

                    const width =
                        ctx.measureText(
                            testLine
                        ).width;

                    if (
                        width > 450 &&
                        currentLine
                    ) {

                        lines.push(
                            currentLine
                        );

                        currentLine = word;

                    } else {

                        currentLine =
                            testLine;
                    }
                }

                if (currentLine) {

                    lines.push(
                        currentLine
                    );
                }

                // Atur posisi teks
                const lineHeight = 65;

                const totalHeight =
                    lines.length * lineHeight;

                let y =
                    (512 - totalHeight) / 2
                    + lineHeight / 2;

                lines.forEach(line => {

                    ctx.fillText(
                        line,
                        256,
                        y
                    );

                    y += lineHeight;
                });

                // Ubah canvas menjadi media
                const imageBuffer =
                    canvas.toBuffer(
                        'image/png'
                    );

                const { MessageMedia } =
                    require(
                        'whatsapp-web.js'
                    );

                const media =
                    new MessageMedia(
                        'image/png',
                        imageBuffer.toString(
                            'base64'
                        ),
                        'stiker.png'
                    );

                // Kirim sebagai stiker
                await client.sendMessage(
                    message.from,
                    media,
                    {
                        sendMediaAsSticker: true
                    }
                );

                return;
            }

            // ====================================
            // COMMAND TIDAK DITEMUKAN
            // ====================================

            await message.reply(
`❓ Command tidak ditemukan.

Ketik !menu untuk melihat
daftar command.`
            );

        } catch (error) {

            console.error(
                'ERROR BOT:',
                error
            );

            try {

                await message.reply(
                    '❌ Terjadi kesalahan pada bot.'
                );

            } catch (replyError) {

                console.error(
                    'Gagal mengirim pesan error:',
                    replyError
                );
            }
        }
    }
);

// ========================================
// JALANKAN BOT
// ========================================

client.initialize();