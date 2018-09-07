var mongoose = require("mongoose");
var Dish = require("./models/menu");
var Comment = require("./models/comment");

var data = [
    {   name: "Chicken Kari",
        image: "https://lh3.googleusercontent.com/l_1Md188uIi_LV1rzyyDIafjk21FVeUhX_7QBP4_C6nG86Ci32CGATWKwIDQn7VYqQj5xWmzznMG8THzErvUm0vY0Nghi477DJTEtF6NhLiZkVa2JH_Z5MiXeie28LJE4v_v62f0yBJj5r9P4nNVGntXRPu4ScyGsiFTSzm4sUI54sqqtK5zF-qI2LwGCbINBUghaU6DUTC8mkpj-w5S2jD0uydqBkPh1NWUM8YoPgnTol1uIedwFM0Wu24GTXjJi5r8hlmKeYm9XDK5GMoPoylN_4eXxDxYz6JIqV-POfFY1mxn-9WMX1Cy8ZLkbkI0j0jzbSHS-LmWT-F7S_9okfGwNWgd11Jn393zywSc59z5JI7xuci6uw0I8RqEKXI27I1tDDdT9StI4CDtgYaX7ckVRaJ9kVxODM7x3mrsZ1VCqmFhgnc8n71UlG2oE-yAEJDx-hNByMhRO2IzdMff9AsQeMMGlqU0XxekDVhhbkv4_5Rd0HWmT7KPciNPD1oXdfw3h0mnwql25EqsbpUIptEi-_AwW4AcpVYvgYgCeapXPIyRDP6ZP4oJS_Bfli_zT1qoZVurrYx_AwrE0aVBrPo_s27LcRda3N_fY7oa=w812-h956-no",
        description: "Grilled Chicken cooked in a nutty and creamy sauce."
    },
    {   name: "Mutton Keema",
        image: "https://lh3.googleusercontent.com/gCMbkmsEkKLmkBo9q3rjINSkn2C3m82IerRUJbnm_TcCGKKvzTmtdkDv4vjVMeSkqqQ_fiYUOkk4OS9X-omUQWOHu1tidaXgB0bmD0PcKk1CocOjexDM0GWe2yc0Szct9mU3HzsrfmLM5AWlTOZRpie2J59ty_tt9FuKLpMUGyz6yoCujbykyef0Wqm_I2GKen3Xf-9k9AVQxvArM_pNQO_iz3m9uuGnIsexRAtXWYAHbZT88B7Qgy3MpLNPZs26mIjX4-RUOhk_E_x0xeaMjaQv_r5Ci0yILCdZKaBHjEDCJ8kx9CsDd92iE-kLws7ASSRR5bwFvJIsYAo0nPEKIjd6PbzLT_wsrw7thFNUAhBbF1XX8Rcsk965cVxOAcBvB6LpI5pBFXux7scbgsWYcIiLEpWY5W9cWNyeOy0cp3rtW5ro6S3u4REpTKFbtJ64sxXc5yLiGVS3kGXvhA0U6z-pFbpn_XLMSr28U2tt8NcuY0NMGSaFjKbzrErkRvBU0KxVX3MTzXtKaq6WugHIZm2k0GaBLEWJkyLHCokFtcIzTYU2WFMIZ7XNVls3yiyvQX90-5XHEdASlzaV6S_NIVckM_FNBw5Kz00LYW8G=w1068-h999-no",
        description: "Minced lamb cooked in tomato puree with potatoes and peas."
    },
    {   name: "Butter Chicken",
        image: "https://lh3.googleusercontent.com/0x86GOpjdLUBEWSfqWhPHh74s_vY9OdsvEurDjUfawh_2xHYWScNDz7sW3tfBUzVGd0cF00rD1Gjtw-2cis5vaxO0bPS4Dd4jiesLMwb7N5IgpnQqb0iSLNVLvxqAANKlAljin-qA44RWpaUAGcNGE9CQtfF4o3110xQojlAEyc3TpTBwGlqxMEYYCL5RHq_k-2UJqbHpJl4RrguItGxJ0bOtFYyeMGuK42If-H5-Fup5mvgp4hQCYd1DJGZod6PnickX3L-wKZ9hCEktxwjpJ6mc1mlPYmq0KYC1Gy1FoRGXlPmabX8OWW08y6t2DtbGcwHKYb5a2_caziOZqBPAzNa6JIuB8AYtM9Clf2xY-kpsTAtgFeeSEqzKdo4jpA4O7dXqo9nvHDfnVF4EpvF8IY6gdM7CDSXGRPFkc3YCsbvYuWgDx_58nTRdRwaJWfQr5lxwhNOnfe3Us8ht-dKxfuyuIBCpf_QVO4Y4ov6j-ukVL3mulITKRTkEePAUqI3BA1QMJeWp8SrjOIN5Z255vLLnQpqMrxHJcXtP9S6advy29KCxTmuF1js6e4hQY70EccCv0MfqZzzrSAcVs-KlGzRu9V3SMwbBMim1CTo=w717-h755-no",
        description: "Spcied Chicken cooked in creamy tomato sauce"
    }
]

function seedDB(){
    //Remove all dishes
    Dish.deleteMany({}, function(err){
  /*      if (err){
        console.log(err);
        }
        console.log("removed dishes");
    });
    //add a few dishes
    data.forEach(function(seed){
        Dish.create(seed, function(err, dish){
            if(err){
                console.log(err);
            } else {
                console.log("added a dish");
                //create a comment
                Comment.create(
                    {
                        text: "This dish is great!",
                        author: "David"
                    }, function (err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            dish.comments.push(comment);
                            dish.save();
                            console.log("created new comment");
                        }
                    });
            }
        });
       */ 
    });
}

module.exports = seedDB;
