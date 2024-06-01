const {Story, StoryVersionControl} = require('../models')

module.exports = {
  async saveStory (req, res) {
    try {
        console.log(req.body)
        const existingStory = await Story.findOne({
            where: {
                storyTitle: req.body.title,
                userID: req.body.userID
            }
          })

        if (existingStory) {
            console.log("Story already exsist.")
            return res.status(403).send({
              error: 'Story with Title already exsist.'
            })
        }

        const story = await Story.create({
            storyTitle: req.body.title,
            userID: req.body.userID
        })

        if(story){
            console.log("Story Create.")
            const storyVersion = await StoryVersionControl.create({
                storyTitle: req.body.title,
                storyId: story.id,
                storyVersion: 1,
                storyPrompt: req.body.storyPrompt,
                StoryResponse: req.body.StoryResponse,
                characterName: req.body.characterName,
                characterRole: req.body.characterRole,
                setting: req.body.setting,
                country: req.body.country,
                language: req.body.language,
                genre: req.body.genre,
                wordCount: req.body.wordCount,
            })
            if(storyVersion){
                console.log("Story Version control Create.")
                res.send(storyVersion.toJSON())
            }
        }
        else{
            console.log(err)
            res.status(400).send({
                error: 'Some issue occured while saving story.'
            })
        }
    } catch (err) {
      console.log(err)
      res.status(400).send({
        error: 'Some issue occured while saving story.'
      })
    }
  },
  async getStory (req, res) {
    try {
      const {email, password} = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })

      if (!user) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }

      const isPasswordVaild = password === user.password
      if (!isPasswordVaild) {
        return res.status(403).send({
          error: 'The login information was incorrect'
        })
      }

      res.send(user.toJSON())
      
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to log in'
      })
    }
  },
  async getAllStories (req, res) {
    try {
      const user = await User.findAll({
        Limit:30
      })
      console.log("Found User")
      res.send(user)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to get user'
      })
    }
  },
  async deleteStories (req, res) {
    try {
      const user = await User.destroy({
        where: { id: req.params.id}
      })
      console.log("Deleted User")
      res.send({status: "Success", deletedUser: user})
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to delete User: ' + err
      })
    }
  }
}
