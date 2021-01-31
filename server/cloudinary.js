const cloudinary = require('cloudinary');


cloudinary.config({
    cloud_name: 'luxio',
    api_key: '492869636989511',
    api_secret: 'mrLuIPL09ohLF-Q5GC2V9bY6r0g'
});


exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            }, {
                resource_type: "auto",
                folder: folder
            })
        })
    })
};