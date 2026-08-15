const pool=require("../config/db.js");
const bcrypt=require("bcrypt");
const { generateToken } = require("../services/auth.js");
async function registerUser(req,res){
    console.log(req.body);
    try{
        const {username,email,password}=req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message:"all fields are required"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const sql=`insert into users(username,email,password) values($1,$2,$3) RETURNING username,email,created_at`;
        const result=await pool.query(sql,[username,email,hashedPassword]);
        res.status(200).json({
            message:"created succesfully",
            user:result.rows[0]
        })
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            message:err
        })
    }
}

async function loginUser(req,res){
    try{
        const {username,password}=req.body;
        if(!username || !password){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
        const sql=`select * from users where username=$1`;
        const result=await pool.query(sql,[username]);
        if(result.rows.length===0){
            return res.status(400).json({
                message:"username is incorrect"
            })
        }
        const user=result.rows[0];
        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({
                message:"password is incorrect"
            })
        }
        const token=generateToken(user.id);
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:24*60*60*1000
        });

        return res.status(200).json({
            message:"login succesfull",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(404).json({
            message:err
        })
    }
}

async function getMe(req,res){
    try{
        const sql=`select id,username,email,created_at from users where id=$1`;
        const result=await pool.query(sql,[req.user]);
        if(result.rows.lenght===0){
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message:"succsess",
            user:result.rows[0]
        })
    }
    catch(err){
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

async function updatePassword(req,res){
    try{
        const {email,password,updatePassword}=req.body;
        if(!email || !password || !updatePassword){
            return res.status(400).json({
                message:"all fields are required"
            })
        }
        const sql=`select email,password from users where email=$1`;
        const result=await pool.query(sql,[email]);
        if(result.rows.length===0){
            return res.status(401).json({
                message:"invalid username"
            })
        }
        const user=result.rows[0];
        const match=await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(401).json({
                message:"incorrect pasword"
            })
        }
        else{
            const sql1=`update users set password=$1 where email=$2`
            const hpassword=await bcrypt.hash(updatePassword,10);
            const result=await pool.query(sql1,[hpassword,email]);
            return res.status(200).json({
                message:"updated sucsessfully"
            })
        }
    }
    catch(err){
        return res.status(400).json({
            message:err
        })
    }
}
module.exports={
    registerUser,
    loginUser,
    getMe,
    updatePassword
}