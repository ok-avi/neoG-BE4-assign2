const express = require("express")
require("dotenv").config()
const {Recipe} =require("./models/recipe.models.js")
const {initializeDB} = require("./db/db.connect.js")
const app = express()

initializeDB()
app.use(express.json())
app.use(cors())

async function createRecipe(data) {
    try {
        const recipe = Recipe(data)
        const savedRecipe = await recipe.save()
        return recipe
    } catch (error) {
        throw error
    }
}

app.post("/recipes",async(req,res)=>{
    try {
        const recipe = await createRecipe(req.body)
        if(recipe){
            res.status(201).json({message:"Recipe created"})
        }
    } catch (error) {
        res.status(500).json({error:"Error while creating recipe"})
    }
})

async function readAllRecipe() {
    try {
        const recipe = await  Recipe.find()
        // console.log("worked",recipe)
        return recipe
    } catch (error) {
        throw error
    }
}

app.get("/recipes",async(req,res)=>{
    try{
        const recipe = await readAllRecipe()
        if(recipe.length){
            res.status(200).json(recipe)
        } else{
            res.status(404).json({message:"Recipe does not found"})
        }
    }
    catch(error){
        res.status(500).json({error:"Error while fetching recipe"})
    }
})

async function readRecipeByKeyValue(key,value){
    try{
        const recipe = await Recipe.findOne({[key]:value})
        return recipe
    } catch(error){
        throw error
    }
}

app.get("/recipes/title/:recipeTitle",async(req,res)=>{
    try {
        const recipe = await readRecipeByKeyValue("title",req.params.recipeTitle)
        if(recipe){
            res.status(200).json(recipe)
        } else{
            res.status(404).json({message:"Recipe not found"})
        }
    } catch (error) {
        res.status(500).json({error:"Error while fetching recipe by title"})
    }
})

app.get("/recipes/author/:recipeAuthor",async(req,res)=>{
    try{
        const recipe = await readRecipeByKeyValue("author",req.params.recipeAuthor)
        if(recipe){
            res.status(200).json(recipe)
        } else{
            res.status(404).json({message:"Recipe not found"})
        }
    } catch(error){
        res.status(500).json({error:"Error while fetching recipe by author"})
    }
})

async function readRecipeByKeyValueArray(key,value){
    try{
        const recipe = await Recipe.find({[key]:value})
        return recipe
    } catch(error){
        throw error
    }
}

app.get("/recipes/difficulty/:level",async(req,res)=>{
    try {
        const recipe = await readRecipeByKeyValueArray("difficulty",req.params.level)
        if(recipe.length){
            res.status(200).json(recipe)
        } else{
            res.status(404).json({message:"Recipe not found"})
        }
    } catch (error) {
        res.status(500).json({error:"Error while fetching recipes by difficulty level"})
    }
})

async function updateRecipe(key,value,dataToUpdate) {
    try {
        const recipe = await Recipe.findOneAndUpdate({[key]:value},dataToUpdate,{new:true})
        return recipe
    } catch (error) {
        throw error
    }
}

app.post("/recipes/update/:title",async(req,res)=>{
    try{
        const recipe = await updateRecipe("title",req.params.title,req.body)
        res.status(200).json({message:"Recipe updated",recipe:recipe})
    } catch(error){
        res.status(500).json({error:"Error while updating recipes "})
    }
})

async function deleteRecipeById(id){
    try {
        const recipe = await Recipe.findByIdAndDelete(id)
        return recipe
    } catch (error) {
        throw error
    }
}


app.delete("/recipes/:recipeId",async(req,res)=>{
    try {
        const recipe = await deleteRecipeById(req.params.recipeId)
        if(recipe){
            res.status(200).json({message:"Recipe deleted",recipe:recipe})
        } else{
            res.status(404).json({message:"Recipe not found"})
        }
    } catch (error) {
        res.status(500).json({error:"Error while deleting recipe by id"})
    }
})

const PORT = process.env.PORT
app.listen(PORT,()=>{
    console.log("Server running at port",PORT)
})