from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from transformers import pipeline
import fitz  # PyMuPDF
import os

# Load the summarizer once
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

@api_view(['POST'])
def summarize_text(request):
    text = request.data.get('text', '')

    if not text:
        return Response({'error': 'No text provided'}, status=400)

    try:
        text = text[:1024]
        summary = summarizer(text, max_length=150, min_length=40, do_sample=False)
        return Response({'summary': summary[0]['summary_text']})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@parser_classes([MultiPartParser])
def upload_file(request):
    uploaded_file = request.FILES.get('file')

    if not uploaded_file:
        return Response({'error': 'No file uploaded'}, status=400)

    try:
        content = ""

        if uploaded_file.name.endswith(".pdf"):
            doc = fitz.open(stream=uploaded_file.read(), filetype="pdf")
            for page in doc:
                content += page.get_text()

        elif uploaded_file.name.endswith(".txt"):
            content = uploaded_file.read().decode('utf-8')

        else:
            return Response({'error': 'Unsupported file type. Please upload PDF or TXT.'}, status=400)

        content = content[:1024]
        summary = summarizer(content, max_length=150, min_length=40, do_sample=False)
        return Response({'summary': summary[0]['summary_text']})

    except Exception as e:
        return Response({'error': str(e)}, status=500)
