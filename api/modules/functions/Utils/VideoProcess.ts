import {join} from "path"
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { execFile } from 'child_process';
import { promisify } from 'util';

export async function CutVideos(path: string): Promise<string> {
    const mediaName: string = (Math.random() + 1).toString(36).substring(7);
    const pathToSave: string = join(__dirname, '..', '..', 'temp', '/') + mediaName + '.webp';
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
          pathToSave
     ];
    const execFilePromise = promisify(execFile);
  
    try {
      await execFilePromise(ffmpegCommand, ffmpegArgs);
        return pathToSave;
    } catch (error) {
        console.error("err:", error)
        return 'no-data'
    }
  }
  
export async function ConvertVideo(path: string): Promise<string> {
      const mediaName: string = (Math.random() + 1).toString(36).substring(7);
      const pathToSave: string = join(__dirname, '..', '..', 'temp', '/') + mediaName + '.webp';
      const ffmpegCommand = ffmpegPath.path;
      const ffmpegArgs:string[]= [ 
          '-i', path,
          '-y',
          '-lossless', '0',
          '-loop', '0',
          '-an',
          '-vf', `scale=iw*min(800/iw\\,800/ih):ih*min(800/iw\\,800/ih),pad=800:800:(800-iw*min(800/iw\\,800/ih))/2:(800-ih*min(800/iw\\,800/ih))/2`,
          '-c:v', 'libwebp',
          '-b:v', '200k', // Exemplo de bitrate de 200k (200 kilobits por segundo)
          '-r', '20', // Exemplo de taxa de quadros de 20 fps (quadros por segundo)
          '-qscale', '3',
          '-s', `800x800`,
          pathToSave
    ];  
      const execFilePromise = promisify(execFile);
      try {
          await execFilePromise(ffmpegCommand, ffmpegArgs);
          return pathToSave;
      } catch (error) {
          console.error("err:", error)
          return 'no-data'
      }
}