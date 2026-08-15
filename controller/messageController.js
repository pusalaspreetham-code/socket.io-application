const pool=require("../config/db.js");

async function sendMessage(req,res){
    try{
        const {roomId}=req.params;
        const {message}=req.body;
        const userId=req.user;
        
        if(!message){
            return res.status(400).json({
                message: "Message is required"
            });
        }
    
        const sql=`select room_id from rooms where room_id=$1 and $2=ANY(users)`;
    
        const roomRes=await pool.query(sql,[roomId,userId]);
        if (roomRes.rows.length === 0) {
            return res.status(403).json({
                message: "You are not a member of this room"
            });
        }
    
        const sql2=`insert into messages(room_id,sender_id,message) values($1,$2,$3) RETURNING *`;
    
        const result = await pool.query(
            sql2,
            [roomId,userId,message]
        );
        
        const userSql = `
            SELECT username
            FROM users
            WHERE id = $1
        `;
        
        const userResult = await pool.query(userSql,[userId]);
        
        const newMessage = {
            ...result.rows[0],
            username:userResult.rows[0].username
        };
        
        const io = req.app.get("io");
        
        io.to(`room-${roomId}`).emit(
            "new-message",
            newMessage
        );
        return res.status(201).json({
            message:"message sent successfully",
            data:newMessage
    });
}
    catch(err){
        return res.status(400).json({
            message:err
        })
    }
}

async function getAllMessages(req, res) {
    try {
        const { roomId } = req.params;
        const userId = req.user;

        const roomSql = `
            SELECT room_id
            FROM rooms
            WHERE room_id = $1
            AND $2 = ANY(users)
        `;

        const roomResult = await pool.query(roomSql, [
            roomId,
            userId
        ]);

        if (roomResult.rows.length === 0) {
            return res.status(403).json({
                message: "You are not a member of this room"
            });
        }

        const sql = `
            SELECT 
                m.message_id,
                m.room_id,
                m.sender_id,
                u.username,
                m.message,
                m.created_at
            FROM messages m
            JOIN users u
                ON m.sender_id = u.id
            WHERE m.room_id = $1
            ORDER BY m.created_at ASC
        `;

        const result = await pool.query(sql, [roomId]);

        return res.status(200).json({
            messages: result.rows
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports={sendMessage,getAllMessages}