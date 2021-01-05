const fs = require('fs-extra');
//const makeDir = require('make-dir');
const klaw = require('klaw');
const path = './files/';
const items = [];
let toRedirect = "";

module.exports = {
  index: async (req, res) =>{
    try{
      res.render( 'index' );
      klaw(path)
        .on('readable', function (){
          let item
          while((item = this.read())){
            items.push(item.path);
          }
        }).on('end', () => console.dir(items)); 

    }catch(error){
      res.send('Algo salió mal ' + error);
    }
  }, 
  filesU: async(req, res)=>{
    try{
      fs.readdir('./files', (err, files) =>{
        res.render('filesU', {files});
      }); 
    }catch(error){
      res.send("Algo salió mal" + error);
    }
  },
  download: async (req, res) =>{
try{
  let file2Download =  req.params.file2D;
  items.forEach(route2D =>{
    if(route2D.includes(file2Download)){
      res.download(route2D, function(err){
        if(err){
          console.log(`Algo salió mal: ${err}`);
        }else{
          console.log("Descargando...");
        }
      })
    }
  })

}catch(error){
  res.send("Algo salió mal " + error);
}
  },
  upload: async (req, res)=>{
   try{
    let nFile = req.files.file;
    nFile.mv(`./files/${nFile.name}`, err=>{
      if(err){
        //return res.status(500).send({ message: err });
        res.send("Algo salió mal " + err);
      }else{
        res.redirect('/');
      }
    });
   }catch(error){
     res.send("Algo salió mal " + error);
   }
  },
  remove: async (req, res) =>{
    try{
      let route2Remove = req.params.file2R;
      let counter = 0;
      items.forEach(file2RM =>{
        counter++;
        if(file2RM.includes(route2Remove)){
          fs.remove(file2RM);
          toRedirect = file2RM;
        } 
      })
      //aqui
      console.log(`Eliminando: ${route2Remove}`);
      res.redirect('/deleteRedirect')
    }catch(err){
      console.log("Error: " + err);
    }
  },
 deleteRedirect: (req, res)=>{
    try{
      console.log("Entra al delete redirect"); 
      let redirecting = toRedirect.split('/').slice(0, -1).join('/');
      console.log(`Redirigir a: ${redirecting}`)
      fs.readdir(redirecting, (err, files)=>{
        res.render('filesU', { files });
      });
    }catch(err){
      console.log(`Algo salió mal: ${err}`);
    }
  },
  newFolder: async (req, res)=>{
    try{
      await fs.ensureDir(path+req.body.folderName)
      res.redirect('/filesU');
    }catch(err){
      console.log("Algo salió mal: " + err);
    }
  },
  surf: (req, res) =>{
    try{
      let folder2search = req.params.folder;
      items.forEach(route=>{
        if(route.includes(folder2search)){ 
          fs.readdir(route, (err, files)=>{
            res.render('filesU', {files});
          })
        }
      })
    }catch(err){
      console.log("Algo salió mal: " + err);
    }
  } 
}

