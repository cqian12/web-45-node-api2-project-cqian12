// implement your posts router here
const express = require('express')
const Posts = require('./posts-model')
const router = express.Router()

router.get('/', (req,res) => {
    Posts.find()
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})

router.get('/:id', (req,res) => {
    Posts.findById(req.params.id)
        .then(post => post ? res.status(200).json(post)
        : res.status(404).json({ message: "The post with the specified ID does not exist" }))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.post('/', (req,res) => {
    const newPost = req.body
    !newPost.title || !newPost.contents ? 
    res.status(400).json({ message: "Please provide title and contents for the post" })
    : Posts.insert(newPost)
        .then(res.status(201).json(newPost))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        })
})

router.put('/:id', (req,res) => {
    const { title, contents } = req.body
    const { id } = req.params
    
    !title || !contents ? 
    res.status(400).json({ message: "Please provide title and contents for the post" })
    : Posts.findById(id)
        .then(post => {
            if(!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
                return Posts.update(id, req.body)
            }
        })
        .then(result => {if (result) {
            return Posts.findById(id)
        }
        })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be modified" })
        })
})

// router.put('/:id', async (req,res) => {
//     const { title, contents } = req.body
//     if(!title || !contents) { 
//         res.status(400).json({ message: "Please provide title and contents for the post" })
//     } else {
//         try {
//         const postFound = await Posts.findById(req.params.id)

//         if(!postFound) {    
//             res.status(404).json({ message: "The post with the specified ID does not exist" })
//         } else {
//             return Posts.update(req.params.id, req.params.body)
//         }
//     }
//     } catch(err) {
//         console.log(err)
//         res.status(500).json({ message: "The post information could not be modified" })
//     }
    
    
//      Posts.findById(id)
//         .then(result => {
//             if(!result) {
//                 res.status(404).json({ message: "The post with the specified ID does not exist" })
//             } else {
//             return Posts.update(id, revisedPost)
//             }
//         })
//         .then(updated => res.status(200).json(updatedPost))
//     })

router.delete('/:id', (req,res) => {
    Posts.remove(req.params.id)
        .then(post => post ? res.status(200).json({ message: "Post deleted"})
        : res.status(404).json({ message: "The post with the specified ID does not exist" }))
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})

router.get('/:id/comments', async (req,res) => {
    try {
        const post = await Posts.findById(req.params.id)
        
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const comments = await Posts.findPostComments(req.params.id)
            res.json(comments) 
        }
     } catch(err) {
        console.log(err)
        res.status(500).json({ message: "The post information could not be retrieved" })
    }
})

module.exports = router