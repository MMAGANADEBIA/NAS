const fs = require('fs-extra');
//const makeDir = require('make-dir');
const klaw = require('klaw');
const path = './files/';
const items = [];

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
      items.forEach(file2RM =>{
        if(file2RM.includes(route2Remove)){
          let toRedirect = file2RM;
          fs.remove(file2RM);
          console.log(`Eliminando: ${route2Remove}`);
          let redirecting = toRedirect.split('/').slice(0, -1).join('/');
          console.log(redirecting);
          //res.redirect('/deleteRedirect');
          //redireccionar a la misma ruta (redirecting)
          //return redirecting;
              klaw(path)
                .on('readable', function (){
                let item
                while((item = this.read())){
                items.push(item.path);
                }
              }).on('end', () => console.dir(items)); 
          fs.readdir(redirecting, (err, files) =>{
            res.redirect('/filesU', redirecting);
          });
        }
      })
    }catch(err){
      console.log("Error: " + err);
    }
  },
 deleteRedirect: (req, res, redirecting)=>{
    try{
      console.log("Entra al delete redirect");
      fs.readdir(redirecting, (err, files)=>{
        res.render('filesU', { files });
      });
    }catch(err){
      console.log(`Algo salió mal: ${err}`);
    }
  },
  /*newFolder: (req, res)=>{
    try{
      (async () =>{
        const path = await makeDir('./files/'+req.body.folderName);
        console.log(path);
      })();
      res.redirect('/filesU');
    }catch(err){
      console.log("Algo salió mal: " + err);
    }*/
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

