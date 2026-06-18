import re

def tokenize(text: str) -> set[str]:

    text = text.lower()
    text = re.sub(re.compile(r'[^\w\s]', re.UNICODE), '', text)
    
    stop_words = {"i", "u", "na", "o", "za", "da", "sa", "od", "do", "je", "su", "ce", "se", "a", "ili"}
    
    words = text.split()
    return {word for word in words if word not in stop_words and len(word) > 1}

def calculate_jaccard_similarity(title1: str, title2: str) -> float:

    set1 = tokenize(title1)
    set2 = tokenize(title2)
    
    if not set1 or not set2:
        return 0.0
        
    intersection = set1.intersection(set2)
    union = set1.union(set2)
    
    return len(intersection) / len(union)