const fs = require('fs-extra');
const fs1 = require('fs')
const getSize = require('get-folder-size');
let rootSize
let rootSizeGB
let folderSize
let availableMB
let availableGB
let totalMB
let totalGB
const klaw = require('klaw');
const path = './files/';
let routeGS
const items = [];
let toRedirect = "";
//const df = require('@keltharan/df');
var diskusage = require('diskusage-ng');
let actualUser
let actualPassword

module.exports = {
  home: async (req, res) =>{
    try{

      let username = req.body.username;
      let password = req.body.password;
      actualUser = username;
      //res.send("logeandose");
      if(username == './src/users/'+username+'.json'){
      fs.readJson('./src/users/'+username+'.json', (err, userObj) => {
        if(err) console.log(err)
        //console.log(userObj.username)
        if(password == userObj.password){
          console.log("Son iguales")
        klaw(path)
        .on('readable', function (){
          let item
          while((item = this.read())){
            items.push(item.path);
          }
        }).on('end', () => console.dir(items)); 

        res.render( 'home' );

        }else{
          console.log("No son iguales")
          res.send("usuario o contraseña erronea");
        }
      });
      }else{
        res.send('Usuario o contraseña erronea jgjh');
      }
    }catch(error){
      res.send('Algo salió mal home' + error);
    }
  }, 
  filesU: async(req, res)=>{
    try{
      //get-folder-size module
      getSize('./files', (err, size)=>{
        if(err){throw err;}
        console.log(size + ' bytes');
        rootSize = (size / 1024 / 1024).toFixed(2) + ' MB'; 
        rootSizeGB = size / Math.pow(1024, 3) + ' GB';
        console.log(rootSize)
      })
      //get-folder-size module
      //get space on disk
      //let sod = await df('/');
        //console.log(await df("/"));
      //console.log(sod);
      //get space on disk
       
      //Diskusage-ng
      diskusage('./files', function(err, usage){
        if (err) return console.log(err)
        let total = usage.total;
        totalMB = (total / 1024 / 1024).toFixed(2) + ' MB'
        totalGB = total / Math.pow(1024, 3) + ' GB';
        console.log(`${total} bytes, ${totalMB} y ${totalGB} totales`);
        let used = usage.used;
        let usedMB = (used / 1024 / 1024).toFixed(2) + ' MB';
        console.log(usedMB);
        let available = usage.available;
        availableMB = (available / 1024 / 1024).toFixed(2) + ' MB';
        availableGB = available / Math.pow(1024, 3) + ' GB';

        console.log(`${availableMB} o ${availableGB} disponibles`);
      })
      //Diskusage-ng

      fs.readdir('./files', (err, files) =>{
        res.render('filesU', {files, rootSize, rootSizeGB, availableMB, availableGB, totalMB, totalGB, folderSize});
      });
      
    }catch(error){
      res.send("Algo salió mal: filesU " + error);
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
  res.send("Algo salió mal download" + error);
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
          toRedirect = file2RM;
          fs.remove(file2RM);
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
        res.render('filesU', { files, rootSize, rootSizeGB, availableMB });
      });
    }catch(err){
      console.log(`Algo salió mal: deleteRedirect ${err}`);
    }
  },
  newFolder: async (req, res)=>{
    try{
      await fs.ensureDir(path+req.body.folderName)
      res.redirect('/filesU');
    }catch(err){
      console.log("Algo salió mal: newFolder" + err);
    }
  },
  /*surf: async (req, res) =>{
    try{
      let folder2search = req.params.folder;
      items.forEach(file2GetSize =>{ //revisar esta madre
        if(file2GetSize.includes(folder2search)){
          folderSize = file2GetSize;
          console.log(folderSize);
        }
      })
      getSize(folderSize, (err, size) =>{
        if (err) {
          console.log(`Algo salió mal en getSize: ${err}`);
        }
        console.log(size + ' bytes');
        rootSize = (size / 1024 / 1024).toFixed(2) + ' MB'; 
        console.log(rootSize)
      })

      //diskusage-ng

      //diskusage-ng

      items.forEach(route=>{
        if(route.includes(folder2search)){ 
          fs.readdir(route, (err, files)=>{
            res.render('filesU', {files, rootSize, rootSizeGB, availableMB, availableGB, totalMB, totalGB});
          })
        }
      })
    }catch(err){
      console.log("Algo salió mal: surf " + err);
    }
  },*/
  back: (req, res) =>{
    try{
      console.log("Entra en back");
      let toBack = toRedirect.split('/').slice(0, -1).join('/');
      console.log(toBack);
      fs.readdir(toBack, (err, res)=>{
        if(err){
          console.log(`Algo salió mal:back1 ${err}`);
        }else{
          res.render('filesU', { files });
        }
      })
    }catch(err){
      console.log(`Algo salio mal: back ${err}`)
    }
  },
  index: async (req, res) =>{
    try{
      res.render('index');
    }catch(err){
      console.log(`Algo salió mal: ${err}`);
    }
  },
  createAccount: async (req, res) =>{
    try{
      res.render('createAccount');
    }catch(err){
      console.log(`Algo salió mal a ver: ${err}`);
    }
  },
  writeData: async (req, res) => {
    try{
      let username = req.body.username;
      let password = req.body.password;
      let securityQuestion = req.body.securityQuestion;
      let securityAnswer = req.body.securityAnswer;

      //if (username == )
      fs.writeJson('./src/users/'+username+'.json', { username: username, password: password, securityQuestion: securityQuestion, securityAnswer: securityAnswer }, err => {
        if ( err ) return console.error(err)
        console.log('success');
      })

      //console.log(username, password, securityQuestion, securityAnswer);

      //res.send("writeData")
      res.redirect('/')
    }catch(err){
      console.log(`Algo salió mal hola: ${err}`);
    }
  },
  deleteAccount: async (req, res) =>{
    try{
      //res.send(actualUser);
      let userDelete = './src/users/'+actualUser+'.json';
      fs.remove(userDelete, err => {
        if( err ) return console.error(err);
        console.log('eliminado');
      });
      res.redirect('/');
      console.log(`Eliminado: ${actualUser}`)
      console.log(userDelete);
    }catch(err){
      console.log(`Hay un problema: ${err}`);
    }
  }
  /*,
  logeado: async (req, res)=>{
    try{
      let username = req.body.username;
      let password = req.body.password;
      //res.send("logeandose");
      fs.readJson('./src/users/'+username+'.json', (err, userObj) => {
        if(err) console.log(err)
        //console.log(userObj.username)
        if(password == userObj.password){
          console.log("Son iguales")
          res.redirect('/home')
        }else{
          console.log("No son iguales")
          res.send("usuario o contraseña erronea");
        }
        //console.log(user, passwd)
        
      })
    }catch(error){
      console.log(error);
    }
  }*/
}
