import ErrorHandler from "../utils/errorMiddleware.js";
import  Blog from "../models/dogBlog.models.js";
import cloudinary from "cloudinary";
import catchAsyncError from "../utils/asyncErrorHandler.js";



// POST BLOG->
export const blogPost = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Blog Main Image Is Mandatory!", 400));
  }
  const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
  if (!mainImage) {
    return next(new ErrorHandler("Blog Main Image Is Mandatory!", 400));
  }
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (
    !allowedFormats.includes(mainImage.mimetype) ||
    (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
    (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) ||
    (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
  ) {
    return next(
      new ErrorHandler(
        "Invalid file type. Only JPG, PNG and WEBP Formats Are Allowed!",
        400
      )
    );
  }
  const {
    title,
    description1,
    description2,
    description3,
  } = req.body;

  const userId = req.user._id;
  const userName = req.user.name;
 

  if (!title || !description1|| !description2 || !description3) {
    return next(
      new ErrorHandler("Title, and descriptions Are Required Fields!", 400)
    );
  }

  const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    paraOneImage
      ? cloudinary.uploader.upload(paraOneImage.tempFilePath)
      : Promise.resolve(null),
    paraTwoImage
      ? cloudinary.uploader.upload(paraTwoImage.tempFilePath)
      : Promise.resolve(null),
    paraThreeImage
      ? cloudinary.uploader.upload(paraThreeImage.tempFilePath)
      : Promise.resolve(null),
  ];
  const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes] =
    await Promise.all(uploadPromises);

  if (
    !mainImageRes ||
    mainImageRes.error ||
    (paraOneImage && (!paraOneImageRes || paraOneImageRes.error)) ||
    (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error)) ||
    (paraThreeImage && (!paraThreeImageRes || paraThreeImageRes.error))
  ) {
    return next(
      new ErrorHandler("Error occured while uploading one or more images!", 500)
    );
  }
  const blogData = {
    title,
    description1,
    description2,
    description3,
    createdBy: userId,
    authorName:userName,
    mainImage: {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    },
  };
  if (paraOneImageRes) {
    blogData.paraOneImage = {
      public_id: paraOneImageRes.public_id,
      url: paraOneImageRes.secure_url,
    };
  }
  if (paraTwoImageRes) {
    blogData.paraTwoImage = {
      public_id: paraTwoImageRes.public_id,
      url: paraTwoImageRes.secure_url,
    };
  }
  if (paraThreeImageRes) {
    blogData.paraThreeImage = {
      public_id: paraThreeImageRes.public_id,
      url: paraThreeImageRes.secure_url,
    };
  }
  const blog = await Blog.create(blogData);
  res.status(200).json({
    success: true,
    message: "Blog Uploaded!",
    blog,
  });
});




// DELETE BLOG->
export const deleteBlog = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if(!blog){
        return next(new ErrorHandler("blog deleted",404));
    }
    await blog.deleteOne();

    res.status(200).json({message:"blog deleted",success:true})


})



// GET ALL BLOGS->
export const getAllBlogs = catchAsyncError(async(req,res,next)=>{
    const blogs = await Blog.find();
    res.status(200).json({
        blogs,
        success:true
    })
})



// GET MY BLOG->
export const getMyBlogs = catchAsyncError(async(req,res,next)=>{
    const user = req.user;
    const userId = user._id;
    const blogs = await Blog.find({createdBy:userId});
    res.status(200).json({success:true,blogs});
})




// UPDATE BLOG->
export const updateBlog = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  let blog = await Blog.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  const newBlogData = {
    title: req.body.title,
    description1: req.body.description1,
    description2: req.body.description2,
    description3: req.body.description3,
  };
  if (req.files) {
    const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (
      (mainImage && !allowedFormats.includes(mainImage.mimetype)) ||
      (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
      (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) ||
      (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
    ) {
      return next(
        new ErrorHandler(
          "Invalid file format. Only PNG, JPG and WEBp formats are allowed.",
          400
        )
      );
    }
    if (req.files && mainImage) {
      const blogMainImageId = blog.mainImage.public_id;
      await cloudinary.uploader.destroy(blogMainImageId);
      const newBlogMainImage = await cloudinary.uploader.upload(
        mainImage.tempFilePath
      );
      newBlogData.mainImage = {
        public_id: newBlogMainImage.public_id,
        url: newBlogMainImage.secure_url,
      };
    }

    if (req.files && paraOneImage) {
      if (blog.paraOneImage && blog.paraOneImage.public_id) {
        const blogParaOneImageId = blog.paraOneImage.public_id;
        await cloudinary.uploader.destroy(blogParaOneImageId);
      }
      const newBlogParaOneImage = await cloudinary.uploader.upload(
        paraOneImage.tempFilePath
      );
      newBlogData.paraOneImage = {
        public_id: newBlogParaOneImage.public_id,
        url: newBlogParaOneImage.secure_url,
      };
    }
    if (req.files && paraTwoImage) {
      if (blog.paraTwoImage && blog.paraTwoImage.public_id) {
        const blogParaTwoImageId = blog.paraTwoImage.public_id;
        await cloudinary.uploader.destroy(blogParaTwoImageId);
      }
      const newBlogParaTwoImage = await cloudinary.uploader.upload(
        paraTwoImage.tempFilePath
      );
      newBlogData.paraTwoImage = {
        public_id: newBlogParaTwoImage.public_id,
        url: newBlogParaTwoImage.secure_url,
      };
    }
    if (req.files && paraThreeImage) {
      if (blog.paraThreeImage && blog.paraThreeImage.public_id) {
        const blogParaThreeImageId = blog.paraThreeImage.public_id;
        await cloudinary.uploader.destroy(blogParaThreeImageId);
      }
      const newBlogParaThreeImage = await cloudinary.uploader.upload(
        paraThreeImage.tempFilePath
      );
      newBlogData.paraThreeImage = {
        public_id: newBlogParaThreeImage.public_id,
        url: newBlogParaThreeImage.secure_url,
      };
    }
  }
  blog = await Blog.findByIdAndUpdate(id, newBlogData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Blog Updated!",
    blog,
  });
});