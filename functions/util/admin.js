// const serviceAccount = require("../../mejengapp-4d31f-firebase-adminsdk-c7i1c-4697be777e.json");
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "mejengapp-4d31f",
    "private_key_id": "4697be777ea4220d659b039ba7f02e105bc53cf9",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCXRzphSCRNYEKW\nigAgljboIpBGBXs6H+QraH5LnQNDpdP2S1P+21enHB+JILwmCrwNv4KTQ9Njy9kJ\n3KXtmBGZy3JgfkCPo6NSvrIxvnWlqmREgYjckzBpU/9m6AHs6TDpox0jnPrO6ket\ng/A3cSfVqn5i6+CMqomY8GQDipx2vra7poZbiTJyANZ4xXJ7V4v4RJeqFsh02Ckm\nDYjsWo8auNqDMTDVxMk/nXL1U+m19q6RWmel/TyFIO2kvFhaTxrMx7uB3f665Ocj\nP6xMog53uXdml39v5JezoPJq3brA/zJ7nd3PvrcIJLBQo1n6DwCuNbxDSBz8EO5L\nnnxShDm7AgMBAAECggEAMsQjckwMaq74CZ7MBiOCz4nx0p26Sbo0DuElKOjLFKOM\nqyWCTY98LcdBSfpjSXzmuNJg1ly3jtD0x9t1D3OtzGe6vWkA73Mhtv3pvMnGn068\nEUVLEYKPh3k5x2XqZ3+l+3HSsIXYoSF75l3VejWOAaUSfs3bcDk2rc1WMt4MPcik\nXyRqAnAFlikcUC1//VECfuw3TDVvgnGTnNq4cQTw9QhVVTsmQX67lEUWAMMaQ2ZX\ngFYg2WVWK1DN8FjJKseStmiH6OQlF/GQ6i3BSYB01VcunQN8d+/RsfstM6dTvb7R\n3ULpqjr34FnJApVgibB3ISyv2vA8qARqV/Lm2wAfoQKBgQDHz0ZLsu0CjaPWWzyy\n73MnnOnzpJR2yHY0/g/UzmDE7Ds8RkPy97dsm29P3fJVuZEsqg5+2Ze009DGODI+\n0GSZ8WUgi0x7Ul4QRMek9iFnP0MgEFQ7ocYq1WezQil+Lc/fRV9GoOsVWjfKfLyz\nk74zHtP0dAk88ueSlzYYLavoCwKBgQDB0hJj5q+sGeBOeRLm+Tc2mbyN7Hlw4b1c\nzppjF/cLAWTJHQn5rxuhuaAILmdrzG6xTjvj9jGkyQM4ygkiK0kJynsgkxd9nEtH\nXJHOVWBfE+mLHxB8OzTKRTFyHAuOSZEJS+jE6kJis/J+EFrf6ZefjRRQxVyzozqI\n5humh0MTEQKBgGnnQqr8uwKPcDc9RH7Sy4ZDdPzeTpJmzcBoqJtyh3fYfc0EsR8m\njOHTwLvkN32YTYoO2IADdJUzb4SgZIFGkwvFFoSZUIBMt+6Hhgm5Kxs+PKXSAdNZ\ne19YnQ42Eyf9wB/m9QjKYc9/cfKxCpNjy3vs6wq2Ne9ID9VysAlAq8zhAoGAa/v/\nVPt0in0MNIxOFLNqqJf0rlm+uz55wxg0edsjP1Vycn4kTaDa0zrZR1WbNzr5vP0q\nbvJ+bCG2EtC1T/0vvy25dcedwdTvN/4CGiQFAlPUvTb8d0qBOeRdDQdFBOxFyxko\nwXUGsXkyNDwmdTPuzuzKEcozwL3DYfxaEWiw3RECgYBxFkyEcd79hS8voLr2AxiI\n20xbYWvaABM4eZzvpc5Re9VihRONmsiJjPbW80tw0giZ3FzfJ0pr1dvWfgqOznQ7\n8mt/Ev6hJxvI09yVFWxvOXya3CAjWo7IUgh0MdGOlLVT77+jsNdkZY+EBzcp+d61\nmJoofqxbaVanCPWPdAjnQw==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-c7i1c@mejengapp-4d31f.iam.gserviceaccount.com",
    "client_id": "115226718763930764666",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-c7i1c%40mejengapp-4d31f.iam.gserviceaccount.com"
  }),
  databaseURL: "https://mejengapp-4d31f.firebaseio.com",
  storageBucket: "mejengapp-4d31f.appspot.com"
})

const db = admin.firestore()

module.exports = { db, admin }