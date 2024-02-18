const sharp = require('sharp');
import {join} from "path"
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { execFile } from 'child_process';
import { promisify } from 'util';

const pathToSave: string = join(__dirname, '..', '..', 'temp', '/');

async function ConvertImage(midia:Buffer): Promise<Buffer|string>{
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

async function CutImage(midia: Buffer): Promise<Buffer | string> {
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

async function CutVideos(path: string): Promise<string> {
  const mediaName: string = (Math.random() + 1).toString(36).substring(7);
  const ffmpegCommand = ffmpegPath.path;
  const ffmpegArgs:string[]= [
        '-i', path,
        '-y',
        '-lossless', '0',
        '-loop', '0',
        '-an',
        '-vf', 'scale=400:400:force_original_aspect_ratio=increase,crop=400:400, setsar=1',
        '-c:v', 'libwebp',
        '-b:v', '200k', 
        '-r', '20', 
        '-qscale', '3',
        '-s', '400x400',
        pathToSave + mediaName + '.webp'
   ];
  const execFilePromise = promisify(execFile);

  try {
    await execFilePromise(ffmpegCommand, ffmpegArgs);
      return pathToSave + mediaName + '.webp';
  } catch (error) {
      return 'no-data'
  }
}

async function ConvertVideo(path: string, quality:[string, string]): Promise<string> {
    const mediaName: string = (Math.random() + 1).toString(36).substring(7);
    const ffmpegCommand = ffmpegPath.path;
    const ffmpegArgs:string[]= [ 
        '-i', path,
        '-y',
        '-lossless', '0',
        '-loop', '0',
        '-an',
        '-vf', `scale=iw*min(${quality[0]}/iw\\,${quality[1]}/ih):ih*min(${quality[0]}/iw\\,${quality[1]}/ih),pad=${quality[0]}:${quality[1]}:(${quality[0]}-iw*min(${quality[0]}/iw\\,${quality[1]}/ih))/2:(${quality[1]}-ih*min(${quality[0]}/iw\\,${quality[1]}/ih))/2`, // Filtro modificado
        '-c:v', 'libwebp',
        '-b:v', '200k', // Exemplo de bitrate de 200k (200 kilobits por segundo)
        '-r', '20', // Exemplo de taxa de quadros de 20 fps (quadros por segundo)
        '-qscale', '3',
        '-s', `${quality[0]}x${quality[1]}`,
        pathToSave + mediaName + '.webp'
  ];  
    const execFilePromise = promisify(execFile);
    try {
        await execFilePromise(ffmpegCommand, ffmpegArgs);
        return pathToSave + mediaName + '.webp';
    } catch (error) {
        return 'no-data'
    }
  }

  


export {
    ConvertImage, ConvertVideo, CutVideos, CutImage
}