const {Schema} = require("mongoose");
module.exports = mongoose => {
    const notificationSchema = new mongoose.Schema(
        {
            notificationType: String,
            content: String,
            userId: String,
            state: String
        },
        {
            timestamps: true
        }
    );

    notificationSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("Notification", notificationSchema);
}
