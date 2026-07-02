import math
from typing import Dict, Any, List
from collections import defaultdict

def tokenize(text: str) -> List[str]:
    """Lowercase and extract words."""
    return [w.strip(".,;:!?()\"'-_") for w in text.lower().split() if len(w) > 1]

class InMemoryTFIDF:
    """A lightweight, in-memory TF-IDF index for hybrid search."""
    def __init__(self, documents: List[Dict[str, Any]]):
        self.documents = documents
        self.doc_tokens = []
        self.vocab = set()
        self.doc_freqs = defaultdict(int)
        
        # Tokenize documents
        for idx, doc in enumerate(documents):
            # Combine all string values in the dict to create document text
            text_parts = []
            for k, v in doc.items():
                if isinstance(v, str):
                    text_parts.append(v)
                elif isinstance(v, list):
                    text_parts.extend([str(item) for item in v if isinstance(item, str)])
            
            combined_text = " ".join(text_parts)
            tokens = tokenize(combined_text)
            self.doc_tokens.append(tokens)
            
            # Unique tokens in this doc for document frequency
            unique_tokens = set(tokens)
            self.vocab.update(unique_tokens)
            for t in unique_tokens:
                self.doc_freqs[t] += 1
                
        self.num_docs = len(documents)
        self.idfs = {}
        for token, df in self.doc_freqs.items():
            self.idfs[token] = math.log((1 + self.num_docs) / (1 + df)) + 1

    def get_tfidf_vector(self, tokens: List[str]) -> Dict[str, float]:
        tf = defaultdict(int)
        for t in tokens:
            tf[t] += 1
            
        vector = {}
        for token, count in tf.items():
            if token in self.idfs:
                vector[token] = count * self.idfs[token]
        return vector

    def cosine_similarity(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        intersection = set(vec1.keys()) & set(vec2.keys())
        numerator = sum([vec1[x] * vec2[x] for x in intersection])
        
        sum1 = sum([val ** 2 for val in vec1.values()])
        sum2 = sum([val ** 2 for val in vec2.values()])
        denominator = math.sqrt(sum1) * math.sqrt(sum2)
        
        if not denominator:
            return 0.0
        return numerator / denominator

    def search(self, query: str) -> List[tuple[int, float]]:
        """Search and return list of (doc_index, score) sorted."""
        query_tokens = tokenize(query)
        if not query_tokens:
            return [(i, 0.0) for i in range(len(self.documents))]
            
        query_vec = self.get_tfidf_vector(query_tokens)
        
        scores = []
        for idx, doc_tok in enumerate(self.doc_tokens):
            doc_vec = self.get_tfidf_vector(doc_tok)
            sim = self.cosine_similarity(query_vec, doc_vec)
            
            # Boost score for exact substring match in critical fields (e.g. company, role)
            exact_boost = 0.0
            doc = self.documents[idx]
            for key in ["company", "role", "name", "title", "platform"]:
                if key in doc and isinstance(doc[key], str):
                    if query.lower() in doc[key].lower():
                        exact_boost += 0.3
                        
            scores.append((idx, sim + exact_boost))
            
        return sorted(scores, key=lambda x: x[1], reverse=True)


def hybrid_search_items(query: str, items: List[Dict[str, Any]], limit: int = 10) -> List[Dict[str, Any]]:
    """
    Perform a hybrid search combining TF-IDF cosine similarity, keyword matches,
    and reciprocal rank fusion.
    """
    if not items:
        return []
        
    if not query:
        return [{"item": item, "relevance_score": 1.0, "source": "keyword", "rank": i+1} for i, item in enumerate(items[:limit])]

    # 1. TF-IDF Search (acts as semantic/similarity layer in this local setting)
    tfidf_index = InMemoryTFIDF(items)
    tfidf_results = tfidf_index.search(query)
    
    # 2. Simple Substring Text Search (acts as exact keyword matching layer)
    keyword_scores = []
    for idx, item in enumerate(items):
        match_count = 0
        q_words = query.lower().split()
        
        item_str = " ".join([str(val).lower() for val in item.values() if isinstance(val, (str, int, float))])
        for word in q_words:
            if word in item_str:
                match_count += 1
                
        score = match_count / len(q_words) if q_words else 0.0
        keyword_scores.append((idx, score))
        
    keyword_results = sorted(keyword_scores, key=lambda x: x[1], reverse=True)
    
    # 3. Reciprocal Rank Fusion (RRF) to combine rankings
    # Rank maps: doc_idx -> rank (0-indexed)
    tfidf_rank = {doc_idx: r for r, (doc_idx, _) in enumerate(tfidf_results)}
    keyword_rank = {doc_idx: r for r, (doc_idx, _) in enumerate(keyword_results)}
    
    k = 60
    fused_scores = {}
    for idx in range(len(items)):
        # RRF score formula: sum(1 / (k + rank))
        r1 = tfidf_rank.get(idx, len(items))
        r2 = keyword_rank.get(idx, len(items))
        
        fused_score = (1 / (k + r1 + 1)) + (1 / (k + r2 + 1))
        fused_scores[idx] = fused_score
        
    sorted_fused = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
    
    results = []
    for rank, (idx, score) in enumerate(sorted_fused[:limit]):
        # Determine source
        r1 = tfidf_rank.get(idx, len(items))
        r2 = keyword_rank.get(idx, len(items))
        
        source = "hybrid"
        if r1 < r2:
            source = "vector"  # TF-IDF acts as our vector/similarity layer here
        elif r2 < r1:
            source = "keyword"
            
        results.append({
            "item": items[idx],
            "relevance_score": float(score),
            "source": source,
            "rank": rank + 1
        })
        
    return results
