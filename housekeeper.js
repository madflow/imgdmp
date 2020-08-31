const fs = require('fs');

function deleteExpired(db) {
  db.find(
    {
      $where: function () {
        return this.expires !== null && this.expires < new Date();
      },
    },
    function (err, docs) {
      if (err) {
        throw err;
      }
      docs.forEach((image) => {
        fs.unlink(image.path, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log(`DELETED FILE ${image.filename}`);
          }
          db.remove({ _id: image._id }, {}, function (err, numRemoved) {
            if (err) {
              console.log(err);
            }
            console.log(`DELETED DB ENTRY`);
          });
        });
      });
    }
  );
}

module.exports = {
  deleteExpired: deleteExpired,
};
