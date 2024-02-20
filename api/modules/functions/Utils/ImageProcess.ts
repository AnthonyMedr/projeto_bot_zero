const sharp = require('sharp');

export async function ConvertImage(midia:Buffer): Promise<Buffer|string>{
    return new Promise(async (resolve, reject) =>{
        sharp(midia)
            .webp({ quality:85, lossless:false })
            .resize(1080, 1080, {fit: 'contain', background:{r:0, g:0, b:0, alpha:0}})
            .toBuffer((err:any, data:any) => {
                if(err) reject('no-data')
                resolve(data)
            })
    })
}

export async function CutImage(midia: Buffer): Promise<Buffer | string> {
    return new Promise<Buffer | string>((resolve, reject) => {
      sharp(midia)
        .webp({ quality: 85, lossless: false })
        .resize(1080, 1080, { fit: 'cover', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toBuffer((err: any, data: any) => {
          if (err) reject('no-data');
          resolve(data);
        });
    });
}