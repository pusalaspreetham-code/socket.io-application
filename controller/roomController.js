const pool=require("../config/db.js");
async function createRoom(req,res){
    try{
    const {name}=req.body;
    const sql2=`select name from rooms where name=$1`;
    const ver=await pool.query(sql2,[name]);
    if(!name || ver.rows.length>0){
        return res.status(400).json({
            message:"name required or room already exist"
        })
    }
    const created_by = req.user;
    const sql=`insert into rooms(name,created_by,users) values($1,$2,$3) RETURNING *`;
    const result=await pool.query(sql,[name,created_by,[created_by]]);
    return res.status(200).json({
        message:"added succsessfully",
        room:result.rows[0]
    })
    }
    catch(err){
        return res.status(401).json({
            message:err 
        });
    }

}

async function joinRoom(req,res){
    try{
        const {name}=req.body;
        const sql2=`select * from rooms where name=$1`;
        const ver=await pool.query(sql2,[name]);
        if(!name || ver.rows.length==0){
            return res.status(400).json({
                message:"name required or room not exist"
            })
        }
        const roomId=ver.rows[0].room_id;
        console.log(roomId)
        const sql=`update rooms set users=array_append(users,$1) where room_id=$2 RETURNING *`;
        const result=await pool.query(sql,[req.user,roomId]);
        return res.status(200).json({
            message:"added succsessfully",
            room:result.rows[0]
        })
    }
    catch(err){
        return res.status(400).json({
            message:err
        })
    }
}
async function getRooms(req,res){
    try{
        const sql=`
            SELECT room_id, name, created_by, created_at, users
            FROM rooms
            WHERE $1 = ANY(users)
            ORDER BY created_at DESC
        `;

        const result=await pool.query(sql,[req.user]);

        return res.status(200).json({
            message:result.rows
        });
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}
module.exports={
    createRoom,
    joinRoom,
    getRooms
}