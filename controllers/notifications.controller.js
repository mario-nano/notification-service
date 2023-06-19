const db = require("../models")
const Notification = db.notification;

//CREATE
exports.create = async (req, res) => {
    const notification = new Notification(
        {
            notificationType: req.body.notificationType,
            content: req.body.content,
            userId: req.body.userId,
            state: 'new'
        }
    );

    notification
        .save(notification)
        .then(newNotification => {
            res.send(newNotification);
        })
        .catch(err => {
            res.status(500).send({
                err: err,
                message:
                    "Some error occurred while creating a new notification."
            });
        });
};

// Find all notifications
exports.findAll = (req, res) => {
    Notification.find()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving notifications."
            });
        });
};

// Find a single notification with an id
exports.findOne = (req, res) => {
    const id = req.body.notificationId;
    Notification.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Notification with id " + id + " not found." });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving Notification with id=" + id });
        });
};

// Find all Notifications for a user
exports.findAllByUserId = (req, res) => {
    const id = req.body.userId;
    Notification.find({ userId: id })
        .then(data => {
            if (!data)
                res.status(404).send({ message: "No Notifications found for a user with id " + id });
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({ message: "Error retrieving for a user with id = " + id });
        });
};

// Update a Notification state by the id in the request
exports.update = (req, res) => {
    const id = req.body.id;
    Notification.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Notification with id=${id}.`
                });
            } else res.send({ message: "Notification was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Notification with id=" + id
            });
        });
};

// Update a Notification by the id in the request
exports.patch = async (req, res) => {
    const id = req.body.id;
    const notification = await Notification.findById(id).exec();
    if (!notification) return res.status(404).send(`Cannot patch notification with id=${id}.`);

    let query = {
        notificationType: notification.notificationType,
        content: notification.content,
        userId: notification.userId,
        state: notification.state
    };
    let isFound = false;

    for (let key in req.body) {
        if (notification[key] !== req.body[key]) { // Check if field exists
            isFound = true;
            query[key] = req.body[key];
        }
    }

    if (isFound) {
        const updatedNotification = await Notification.updateOne({_id: id}, query).exec();
        res.send('Notification was updated successfully!');
    } else
        res.status(404).send(`Cannot patch notification with id=${id}. All values are same.`);
};

// Delete a notification with the specified id in the request
exports.delete = (req, res) => {
    const id = req.body.id;
    Notification.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete notification with id=${id}. Maybe notification does not exist!`
                });
            } else {
                res.send({
                    message: "Notification was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete notification with id=" + id
            });
        });
};

// Delete one notification with the specified userid in the request
exports.deleteByIdAndByUserId = (req, res) => {
    const id = req.body.id;
    const userId = req.body.userId;
    Notification.findByIdAndDelete({ id: id, userId: userId }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Notification with id=${id} for a User. Maybe notification does not exist!`
                });
            } else {
                res.send({
                    message: "Notifications was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Notification with id=" + id
            });
        });
};

// Delete all notifications with the specified userid in the request
exports.deleteAllByUserId = (req, res) => {
    const userId = req.body.userId;
    Notification.deleteMany({ userId: userId }, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Notifications for a User. Maybe notification does not exist!`
                });
            } else {
                res.send({
                    message: "Notifications deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Notifications"
            });
        });
};

// Delete all notifications from the database.
exports.deleteAll = (req, res) => {
    Notification.deleteMany({})
        .then(data => {
            res.send({
                message: `${data.deletedCount} notifications were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all notifications."
            });
        });
};
